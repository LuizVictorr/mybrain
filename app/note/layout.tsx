import { NotesSidebar } from "@/components/notesSidebar";
import { prisma } from "@/lib/prisma";
import { buildNotesTree } from "@/utils/buildNodesTree";

export default async function NoteLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const notes = await prisma.note.findMany({
        include: {
            references: true,
            referencedBy: true,
        },
    });
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
