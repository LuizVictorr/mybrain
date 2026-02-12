import { Note } from "@/types/note";
import { GraphData } from "@/types/graph";
import { extractLinks } from "./extractLinks";

export function notesToGraph(notes: Note[]): GraphData {
    const nodes = notes.map(note => ({
        id: note.id,
        title: note.title
    }));

    const links = [];

    for (const note of notes) {
        const references = extractLinks(note.content);

        for (const ref of references) {
            const target = notes.find(n => n.title === ref);
            if (target) {
                links.push({
                    source: note.id,
                    target: target.id
                });
            }
        }
    }

    return { nodes, links };
}
