export interface Note {
    id: string;
    title: string;
    content: string;
    parentId?: string | null;
}
