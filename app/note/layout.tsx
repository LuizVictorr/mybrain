import { NotesSidebar } from "@/components/notesSidebar";
import { notes } from "@/database/notes";
import { buildNotesTree } from "@/utils/buildNodesTree";

export default function NoteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const tree = buildNotesTree(notes);

    return (
        <div className="pt-16">
            <div className="flex h-[calc(100vh-4rem)]">
                <NotesSidebar tree={tree} />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
