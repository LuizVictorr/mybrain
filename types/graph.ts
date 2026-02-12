export interface NoteNode {
    id: string;
    title: string;
}

export interface NoteLink {
    source: string;
    target: string;
}

export interface GraphData {
    nodes: NoteNode[];
    links: NoteLink[];
}
