import EditToolForm from "@/components/EditToolForm";
import connectMongoDB from "@/lib/mongodb";
import Tool from "@/models/tool";
import mongoose from "mongoose";

const getToolById = async (id: string) => {
    try {
        console.log("🔍 Server-side fetching tool:", id);

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("❌ Invalid ObjectId format:", id);
            return { tool: null };
        }

        await connectMongoDB();
        console.log("🔗 Database connected for server-side fetch");

        const tool = await Tool.findOne({ _id: id }).lean();

        if (!tool) {
            console.log("❌ Tool not found:", id);
            return { tool: null };
        }

        console.log("✅ Tool found server-side:", (tool as any)._id);

        // Convert MongoDB document to plain object
        const plainTool = JSON.parse(JSON.stringify(tool));

        return { tool: plainTool };
    } catch (error) {
        console.error("❌ Error loading tool server-side:", error);
        return { tool: null };
    }
};

export default async function EditTool({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await getToolById(id);

    if (!result || !result.tool) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Tool Not Found</h1>
                    <p className="text-gray-600">The tool you're looking for doesn't exist or has been removed.</p>
                </div>
            </div>
        );
    }

    const { tool } = result;
    const { name, description } = tool;

    return <EditToolForm id={id} name={name} description={description} />;
}
