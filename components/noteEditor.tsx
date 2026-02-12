"use client";

import { Note } from "@/types/note";
import Link from "next/link";
import { useState } from "react";

type Props = {
    note: Note;
};

export default function NoteEditor({ note }: Props) {
    const [content, setContent] = useState(note.content);

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">{note.title}</h1>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-60 p-3 border rounded"
            />

            {note.links.length > 0 && (
                <div>
                    <h2 className="font-semibold">Conexões</h2>

                    <ul className="list-disc ml-5">
                        {note.links.map((id) => (
                            <li key={id}>
                                <Link
                                    href={`/note/${id}`}
                                    className="text-blue-600 underline"
                                >
                                    {id}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
