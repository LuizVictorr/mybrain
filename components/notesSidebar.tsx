"use client";

import { NoteNode } from "@/utils/buildNodesTree";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function NoteItem({ note, level = 0 }: { note: NoteNode; level?: number }) {
    const [isOpen, setIsOpen] = useState(true); // controlando se os filhos aparecem

    const hasChildren = note.children.length > 0;

    return (
        <div>
            {/* Título da nota */}
            <div
                className="flex items-center cursor-pointer py-1 text-sm hover:underline"
                style={{ paddingLeft: level * 16 }}
                onClick={() => hasChildren && setIsOpen(!isOpen)}
            >
                {hasChildren && (
                    <span className="mr-1">
                        {isOpen ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </span>
                )}
                <Link href={`/note/${note.id}`}>{note.title}</Link>
            </div>

            {/* Renderiza filhos recursivamente */}
            {hasChildren && isOpen && (
                <div>
                    {note.children.map((child) => (
                        <NoteItem key={child.id} note={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

export function NotesSidebar({ tree }: { tree: NoteNode[] }) {
    return (
        <aside className="w-64 border-r p-4 overflow-y-auto">
            <h2 className="font-semibold mb-4">Conhecimento</h2>

            {tree.map((note) => (
                <NoteItem key={note.id} note={note} />
            ))}
        </aside>
    );
}
