"use client";

import { NoteNode } from "@/utils/buildNodesTree";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface NoteItemProps {
    note: NoteNode;
    level?: number;
}

function NoteItem({ note, level = 0 }: NoteItemProps) {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();

    const hasChildren = note.children && note.children.length > 0;

    return (
        <div>
            <div
                className="flex items-center gap-1 cursor-pointer py-1 text-sm hover:bg-gray-100 rounded select-none group"
                style={{ paddingLeft: level * 16 }}
                onClick={() => hasChildren && setIsOpen((prev) => !prev)}
            >
                {hasChildren ? (
                    isOpen ? (
                        <ChevronDown className="w-4 h-4 shrink-0" />
                    ) : (
                        <ChevronRight className="w-4 h-4 shrink-0" />
                    )
                ) : (
                    <span className="w-4" />
                )}

                <Link
                    href={`/note/${note.id}`}
                    className="flex-1 truncate"
                    onClick={(e) => e.stopPropagation()}
                >
                    {note.title}
                </Link>

                {/* Botão criar subnota */}
                <button
                    onClick={async (e) => {
                        e.stopPropagation();

                        const res = await fetch("/api/notes", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                title: "Untitled",
                                content: "",
                                parentId: note.id, // 👈 AGORA VAI CERTO
                            }),
                        });

                        if (!res.ok) {
                            alert("Erro ao criar subnota");
                            return;
                        }

                        const newNote = await res.json();

                        router.push(`/note/${newNote.id}`);
                        router.refresh();
                    }}
                    className="opacity-0 group-hover:opacity-100 transition"
                >
                    <Plus className="w-4 h-4 text-gray-500 hover:text-black" />
                </button>

            </div>

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

interface NotesSidebarProps {
    tree: NoteNode[];
}

export function NotesSidebar({ tree }: NotesSidebarProps) {
    const router = useRouter();

    return (
        <aside className="w-64 border-r p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm uppercase text-gray-500">
                    Conhecimento
                </h2>

                {/* Botão nova nota raiz */}
                <button
                    onClick={async () => {
                        const res = await fetch("/api/notes", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                title: "Untitled",
                                content: "",
                                parentId: null,
                            }),
                        });

                        if (!res.ok) {
                            alert("Erro ao criar nota");
                            return;
                        }

                        const newNote = await res.json();

                        router.push(`/note/${newNote.id}`);
                        router.refresh();
                    }}
                >
                    <Plus className="w-4 h-4 text-gray-500 hover:text-black" />
                </button>
            </div>

            <div className="space-y-1">
                {tree.map((note) => (
                    <NoteItem key={note.id} note={note} />
                ))}
            </div>
        </aside>
    );
}
