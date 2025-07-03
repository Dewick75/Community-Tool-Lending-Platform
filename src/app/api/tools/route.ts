import connectMongoDB from "@/lib/mongodb";
import Tool from "@/models/tool";
import { NextResponse } from "next/server";

// Function to CREATE a new tool
export async function POST(request: Request) {
  try {
    console.log("📝 POST /api/tools - Creating new tool");
    const toolData = await request.json();
    console.log("📋 Tool data:", toolData);

    // Validate required fields
    const { name, description, location, owner } = toolData;
    if (!name || !description || !location?.city || !location?.area || !owner?.name || !owner?.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectMongoDB();
    console.log("🔗 Database connected for POST");

    // Set availability based on legacy status if provided
    if (toolData.status && !toolData.availability) {
      toolData.availability = toolData.status;
    }

    const newTool = await Tool.create(toolData);
    console.log("✅ Tool created successfully:", newTool._id);

    return NextResponse.json({ message: "Tool Created", tool: newTool }, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating tool:", error);
    return NextResponse.json({
      error: "Failed to create tool",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// Function to GET all tools
export async function GET() {
  try {
    console.log("📖 GET /api/tools - Fetching all tools");
    await connectMongoDB();
    console.log("🔗 Database connected for GET");

    const tools = await Tool.find().sort({ createdAt: -1 });
    console.log(`📊 Found ${tools.length} tools`);

    return NextResponse.json({ tools });
  } catch (error) {
    console.error("❌ Error fetching tools:", error);
    return NextResponse.json({ error: "Failed to fetch tools", tools: [] }, { status: 500 });
  }
}

// Function to DELETE a tool
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  await connectMongoDB();
  await Tool.findByIdAndDelete(id);
  return NextResponse.json({ message: "Tool deleted" }, { status: 200 });
}