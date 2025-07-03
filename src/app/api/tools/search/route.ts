import connectMongoDB from "@/lib/mongodb";
import Tool from "@/models/tool";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    console.log("🔍 GET /api/tools/search - Searching tools");

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const city = searchParams.get('city') || '';
    const availability = searchParams.get('availability') || '';
    const condition = searchParams.get('condition') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    console.log("🔍 Search parameters:", {
      query, category, city, availability, condition, sortBy, sortOrder
    });

    await connectMongoDB();
    console.log("🔗 Database connected for search");

    // Wait a moment to ensure connection is stable
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Build search filter
    const filter: any = {};

    // Text search across name, description, and tags
    if (query && query.trim()) {
      const searchRegex = new RegExp(query.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }

    // Category filter
    if (category && category !== 'all' && category.trim()) {
      filter.category = category;
    }

    // Location filter
    if (city && city.trim()) {
      filter['location.city'] = { $regex: city.trim(), $options: 'i' };
    }

    // Availability filter - check both new and legacy fields
    if (availability && availability !== 'all' && availability.trim()) {
      filter.$or = filter.$or ? [...filter.$or] : [];
      filter.$or.push(
        { availability: availability },
        { status: availability } // Legacy field support
      );
    }

    // Condition filter
    if (condition && condition !== 'all' && condition.trim()) {
      filter.condition = condition;
    }
    
    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    console.log("🔍 Final filter:", filter);
    console.log("📊 Sort:", sort);

    // Execute search with retry logic
    let tools = [];
    let aggregationData = [];

    try {
      tools = await Tool.find(filter).sort(sort).lean();
      console.log(`📊 Found ${tools.length} tools matching search criteria`);

      // Get aggregated data for filters
      aggregationData = await Tool.aggregate([
        {
          $group: {
            _id: null,
            categories: { $addToSet: "$category" },
            cities: { $addToSet: "$location.city" },
            conditions: { $addToSet: "$condition" },
            availabilities: { $addToSet: "$availability" },
            statuses: { $addToSet: "$status" }, // Legacy field
            totalTools: { $sum: 1 }
          }
        }
      ]);
    } catch (dbError) {
      console.error("❌ Database query error:", dbError);
      // Try to reconnect and retry once
      try {
        await connectMongoDB();
        await new Promise(resolve => setTimeout(resolve, 200));
        tools = await Tool.find(filter).sort(sort).lean();
        console.log(`📊 Retry successful: Found ${tools.length} tools`);
      } catch (retryError) {
        console.error("❌ Retry failed:", retryError);
        throw retryError;
      }
    }
    
    const filterOptions = aggregationData[0] || {
      categories: [],
      cities: [],
      conditions: [],
      availabilities: [],
      statuses: [],
      totalTools: 0
    };

    // Merge availability and status for backward compatibility
    const allAvailabilities = [
      ...(filterOptions.availabilities || []),
      ...(filterOptions.statuses || [])
    ].filter(Boolean);
    filterOptions.availabilities = [...new Set(allAvailabilities)];
    
    return NextResponse.json({ 
      tools,
      filterOptions,
      searchParams: { query, category, city, availability, condition, sortBy, sortOrder },
      totalResults: tools.length
    });
    
  } catch (error) {
    console.error("❌ Error searching tools:", error);
    return NextResponse.json({ 
      error: "Failed to search tools", 
      tools: [],
      filterOptions: {},
      totalResults: 0
    }, { status: 500 });
  }
}
