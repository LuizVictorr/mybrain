"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DeleteButton from "./deleteButton";
import RichTextEditor from "./richTextEditor";

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
    const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

    useEffect(() => {
        if (title === note.title && content === (note.content ?? "")) {
            return;
        }

        setStatus("saving");

        const timeout = setTimeout(async () => {
            try {
                await fetch(`/api/notes/${note.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title,
                        content,
                    }),
                });

                setStatus("saved");
            } catch (error) {
                console.error(error);
                setStatus("idle");
            }
        }, 800); // tempo de debounce

        return () => clearTimeout(timeout);
    }, [title, content]);

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <input
                className="text-3xl font-bold outline-none w-full mb-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <p className="text-sm text-gray-500 mb-4">
                {status === "saving" && "Salvando..."}
                {status === "saved" && "Salvo ✓"}
            </p>

            <RichTextEditor
                value={content}
                onChange={setContent}
            />


            <DeleteButton id={note.id} />
        </div>
    );
}
