'use client';

import { HiOutlineTrash } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

export default function RemoveBtn({ id }: { id: string }) {
    const router = useRouter();
    const removeTool = async () => {
        const confirmed = confirm('Are you sure you want to delete this tool?');

        if (confirmed) {
            const res = await fetch(`/api/tools?id=${id}`, {
                method: 'DELETE',
            });
            
            if (res.ok) {
                router.refresh();
            }
        }
    };

    return (
        <button
            onClick={removeTool}
            className="text-red-600 hover:text-red-700 transition-colors duration-200"
            title="Delete Tool"
        >
            <HiOutlineTrash size={18} />
        </button>
    );
}
