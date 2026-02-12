import Graph3D from "@/components/graphWithNotes";
import { prisma } from "@/lib/prisma";

export default async function GraphPage() {
    const notes = await prisma.note.findMany({
        include: {
            references: true,
            referencedBy: true,
        },
    });

    return <Graph3D notes={notes} />;
}
