"use client";

import { useRouter } from "next/navigation";

function DeleteButton({ id }: { id: string }) {
    const router = useRouter();

    async function handleDelete() {
        const confirmDelete = confirm("Tem certeza que deseja deletar esta nota?");
        if (!confirmDelete) return;

        await fetch(`/api/notes/${id}`, {
            method: "DELETE",
        });

        router.push("/note");
        router.refresh();
    }

    return (
        <button
            onClick={handleDelete}
            className="text-red-500 text-sm hover:bg-red-200 px-4 py-2 ml-20 rounded"
        >
            Deletar
        </button>
    );
}

export default DeleteButton;
