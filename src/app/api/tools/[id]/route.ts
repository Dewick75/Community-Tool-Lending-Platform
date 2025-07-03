import connectMongoDB from "@/lib/mongodb";
import Tool from "@/models/tool";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// GET a single tool by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log("🔍 GET /api/tools/[id] - Fetching tool:", id);

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ Invalid ObjectId format:", id);
      return NextResponse.json({ error: "Invalid tool ID format" }, { status: 400 });
    }

    await connectMongoDB();
    console.log("🔗 Database connected for GET");

    const tool = await Tool.findOne({ _id: id });

    if (!tool) {
      console.log("❌ Tool not found:", id);
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    console.log("✅ Tool found:", tool._id);
    return NextResponse.json({ tool }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching tool:", error);
    return NextResponse.json({
      error: "Failed to fetch tool",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// UPDATE a tool by ID
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const toolData = await request.json();

    console.log("🔄 PUT /api/tools/[id] - Updating tool:", id);
    console.log("📋 Update data:", toolData);

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ Invalid ObjectId format:", id);
      return NextResponse.json({ error: "Invalid tool ID format" }, { status: 400 });
    }

    await connectMongoDB();
    console.log("🔗 Database connected for PUT");

    // Update the tool with all provided data
    const updatedTool = await Tool.findByIdAndUpdate(
      id,
      toolData,
      { new: true, runValidators: true }
    );

    if (!updatedTool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    console.log("✅ Tool updated successfully:", updatedTool._id);

    return NextResponse.json({
      message: "Tool updated successfully",
      tool: updatedTool
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error updating tool:", error);
    return NextResponse.json({
      error: "Failed to update tool",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
