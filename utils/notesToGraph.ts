import { GraphData } from "@/types/graph";

export function notesToGraph(notes: any[]): GraphData {
    const nodes = notes.map((note) => ({
        id: note.id,
        title: note.title,
    }));

    const links = notes.flatMap((note) =>
        note.references.map((ref: any) => ({
            source: ref.fromId,
            target: ref.toId,
        }))
    );

    return { nodes, links };
}
