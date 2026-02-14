"use client";

import { useState } from "react";
import BlockEditor, { Block } from "./blockEditor";

interface NoteEditorProps {
    note: {
        id: string;
        title: string;
        blocks: Block[] | null;
    };
}

export default function NoteEditor({ note }: NoteEditorProps) {

    const [title, setTitle] = useState(note.title);
    const [blocks, setBlocks] = useState<Block[]>(
        note.blocks?.length
            ? note.blocks
            : [
                {
                    id: crypto.randomUUID(),
                    type: "paragraph",
                    content: "",
                },
            ]
    );

    async function handleChange(updatedBlocks: Block[]) {
        setBlocks(updatedBlocks);

        await fetch(`/api/notes/${note.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                blocks: updatedBlocks, // ✅ agora é blocks
            }),
        });
    }

    async function handleTitleChange(newTitle: string) {
        setTitle(newTitle);

        await fetch(`/api/notes/${note.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: newTitle,
                blocks, // ✅ salvar blocks também
            }),
        });
    }

    return (
        <div className="p-6">
            <input
                className="text-3xl font-bold outline-none mb-6 w-full"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Título..."
            />

            <BlockEditor
                initialBlocks={blocks}
                onChange={handleChange}
            />
        </div>
    );
}
