import NoteEditor from "@/components/noteEditor";
import { prisma } from "@/lib/prisma";

export default async function NotePage({ params }: {
    params: Promise<{ id: string }>
}) {

    const { id } = await params
    const note = await prisma.note.findUnique({
        where: {
            id: id,
        },
    });

    if (!note) {
        return <div className="p-6">Nota não encontrada</div>;
    }

    return <NoteEditor note={note} />;
}
