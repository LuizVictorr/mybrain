import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractLinks } from "@/utils/extractLinks";

export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const { title, content } = await req.json();

    try {
        const updatedNote = await prisma.$transaction(async (tx) => {
            // 1️⃣ Atualiza a nota
            const note = await tx.note.update({
                where: { id },
                data: { title, content },
            });

            // 2️⃣ Remove referências antigas dessa nota
            await tx.reference.deleteMany({
                where: {
                    fromId: id,
                },
            });

            // 3️⃣ Extrai novos links
            const links = extractLinks(content);

            // 4️⃣ Cria novas relações
            for (const toTitle of links) {
                const targetNote = await tx.note.upsert({
                    where: { title: toTitle },
                    update: {},
                    create: {
                        title: toTitle,
                        content: "",
                    },
                });

                await tx.reference.create({
                    data: {
                        fromId: id,
                        toId: targetNote.id,
                    },
                });
            }

            return note;
        });

        return NextResponse.json(updatedNote);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Erro ao atualizar nota" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        await prisma.$transaction(async (tx) => {
            // 1️⃣ Remove referências onde ela é origem
            await tx.reference.deleteMany({
                where: {
                    fromId: id,
                },
            });

            // 2️⃣ Remove referências onde ela é destino
            await tx.reference.deleteMany({
                where: {
                    toId: id,
                },
            });

            // 3️⃣ Remove filhos (subnotas)
            await tx.note.deleteMany({
                where: {
                    parentId: id,
                },
            });

            // 4️⃣ Remove a própria nota
            await tx.note.delete({
                where: { id },
            });
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

