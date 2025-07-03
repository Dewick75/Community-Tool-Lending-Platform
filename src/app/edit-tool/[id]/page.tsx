import EditToolForm from "@/components/EditToolForm";

const getToolById = async (id: string) => {
    try {
        // Use relative URL to avoid port issues
        const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/tools/${id}`, {
            cache: 'no-store',
        });
        if (!res.ok) {
            throw new Error("Failed to fetch tool");
        }
        return res.json();
    } catch (error) {
        console.log("Error loading tool: ", error);
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
                    <h1 className="text-2xl font-bold text-red-600 mb-4" style={{ color: 'black' }}>Tool Not Found</h1>
                    <p className="text-gray-600" style={{ color: 'black' }}>The tool you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                </div>
            </div>
        );
    }

    const { tool } = result;
    const { name, description } = tool;

    return <EditToolForm id={id} name={name} description={description} />;
}
