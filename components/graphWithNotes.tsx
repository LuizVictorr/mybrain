"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { notesToGraph } from "@/utils/notesToGraph";
import NotesPanel from "@/components/notesPainel";

const ForceGraph3D = dynamic(
    () => import("react-force-graph-3d"),
    { ssr: false }
);

export default function Graph3D({ notes }: { notes: any[] }) {
    const router = useRouter();

    const graphData = notesToGraph(notes);

    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className="flex w-full h-[calc(100vh-72px)]">
            <div className="flex-1 bg-white">
                <ForceGraph3D
                    graphData={graphData}
                    nodeLabel={(node: any) => node.title}
                    nodeAutoColorBy="id"
                    linkColor={() => "rgba(0,0,0,0.3)"}
                    backgroundColor="#ffffff"
                    onNodeClick={(node: any, event: MouseEvent) => {
                        if (event.ctrlKey || event.metaKey) {
                            router.push(`/note/${node.id}`);
                        } else {
                            setSelectedNoteId(node.id);
                            setDrawerOpen(true);
                        }
                    }}
                />
            </div>

            <NotesPanel
                open={drawerOpen}
                noteId={selectedNoteId}
                notes={notes}
                onClose={() => {
                    setDrawerOpen(false);
                    setSelectedNoteId(null);
                }}
            />

        </div>
    );
}
