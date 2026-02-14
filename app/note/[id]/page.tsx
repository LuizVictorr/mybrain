import { Block } from "@/components/blockEditor";
import DeleteButton from "@/components/deleteButton";
import NoteEditor from "@/components/noteEditor";
import { prisma } from "@/lib/prisma";

interface PageProps {
    params: Promise<{ id: string }>;
}

// ✅ Type Guard seguro
function isBlockArray(value: unknown): value is Block[] {
    return (
        Array.isArray(value) &&
        value.every(
            (b) =>
                typeof b === "object" &&
                b !== null &&
                "id" in b &&
                "type" in b &&
                "content" in b &&
                typeof (b as any).id === "string" &&
                typeof (b as any).type === "string" &&
                typeof (b as any).content === "string"
        )
    );
}

export default async function NotePage({ params }: PageProps) {

    const { id } = await params
    const note = await prisma.note.findUnique({
        where: {
            id: id,
        },
    });

    if (!note) {
        return <div className="p-6">Nota não encontrada</div>;
    }

    // 🔥 Normalização segura dos blocks
    const parsedBlocks = isBlockArray(note.blocks)
        ? note.blocks
        : null;

    return (
        <div>

            <NoteEditor
                note={{
                    id: note.id,
                    title: note.title,
                    blocks: parsedBlocks,
                }}
            />
            <DeleteButton id={note.id} />
        </div>
    );
}
