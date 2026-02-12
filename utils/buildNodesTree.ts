import { Note } from "@/types/note";

export interface NoteNode extends Note {
    children: NoteNode[];
}

export function buildNotesTree(notes: Note[]): NoteNode[] {
    const map = new Map<string, NoteNode>();

    notes.forEach((note) =>
        map.set(note.id, { ...note, children: [] })
    );

    const tree: NoteNode[] = [];

    map.forEach((note) => {
        if (note.parentId) {
            map.get(note.parentId)?.children.push(note);
        } else {
            tree.push(note);
        }
    });

    return tree;
}
