import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractLinks } from "@/utils/extractLinks";

function extractReferencesFromBlocks(blocks: { content: string }[] = []) {
    const regex = /\[\[([^\]]+)\]\]/g;
    const refs = new Set<string>();

    for (const block of blocks) {
        let match;
        while ((match = regex.exec(block.content)) !== null) {
            refs.add(match[1].trim());
        }
    }

    return Array.from(refs);
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });

    const { title, blocks } = await req.json();

    if (!blocks || !Array.isArray(blocks))
        return NextResponse.json({ error: "Blocks inválidos" }, { status: 400 });

    try {
        const updatedNote = await prisma.$transaction(async (tx) => {
            // 1️⃣ Atualiza a nota
            const note = await tx.note.update({
                where: { id },
                data: { title, blocks },
            });

            // 2️⃣ Remove referências antigas
            await tx.reference.deleteMany({ where: { fromId: id } });

            // 3️⃣ Extrai referências de todos os blocos
            const refs = extractReferencesFromBlocks(blocks);

            // 4️⃣ Cria novas referências
            for (const toTitle of refs) {
                const targetNote = await tx.note.upsert({
                    where: { title: toTitle },
                    update: {},
                    create: { title: toTitle, blocks: [] },
                });

                await tx.reference.create({
                    data: { fromId: id, toId: targetNote.id },
                });
            }

            return note;
        });

        return NextResponse.json(updatedNote);
    } catch (error) {
        console.error("Erro no PUT /api/notes/[id]:", error);
        return NextResponse.json({ error: "Erro ao atualizar nota" }, { status: 500 });
    }
}


export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        await prisma.note.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Erro ao deletar nota" },
            { status: 500 }
        );
    }
}

