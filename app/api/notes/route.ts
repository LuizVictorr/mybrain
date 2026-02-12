import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractLinks } from "@/utils/extractLinks";

export async function GET() {
    const notes = await prisma.note.findMany({
        include: {
            referencedBy: true,
            references: true,
        },
    });

    return NextResponse.json(notes);
}

export async function POST(req: Request) {
    const { title, content, parentId } = await req.json();

    // 1️⃣ Criar a nota
    const note = await prisma.note.create({
        data: {
            title,
            content,
            parentId: parentId ?? null,
        },
    });


    // 2️⃣ Extrair links do conteúdo
    const links = extractLinks(content);

    // 3️⃣ Criar relações automaticamente
    if (links.length > 0) {
        await prisma.$transaction(async (tx) => {
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
                        fromId: note.id,
                        toId: targetNote.id,
                    },
                });
            }
        });
    }


    return NextResponse.json(note);
}
