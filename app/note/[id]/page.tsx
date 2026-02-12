import { notes } from "@/database/notes";

export default async function NotePage({ params }: {
    params: Promise<{ id: string }>
}) {

    const { id } = await params
    const note = notes.find((n) => n.id === id);

    if (!note) {
        return <div className="p-6">Nota não encontrada</div>;
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {note.content}
            </div>
        </div>
    );
}
