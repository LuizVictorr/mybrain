"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteButton from "./deleteButton";

interface NoteEditorProps {
    note: {
        id: string;
        title: string;
        content: string | null;
    };
}

export default function NoteEditor({ note }: NoteEditorProps) {
    const router = useRouter();

    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content ?? "");
    const [loading, setLoading] = useState(false);

    async function handleSave() {
        try {
            setLoading(true);

            const res = await fetch(`/api/notes/${note.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    content,
                }),
            });

            if (!res.ok) throw new Error("Erro ao atualizar");

            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <input
                className="text-3xl font-bold outline-none w-full mb-6"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
                className="w-full min-h-[300px] outline-none resize-none text-sm leading-relaxed"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <button
                onClick={handleSave}
                disabled={loading}
                className="mt-4 px-4 py-2 bg-black text-white rounded"
            >
                {loading ? "Salvando..." : "Salvar"}
            </button>
            <DeleteButton id={note.id} />

        </div>
    );
}
