"use client";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { notes } from "@/database/notes";

interface Props {
    open: boolean;
    noteId: string | null;
    onClose: () => void;
}

export default function NotesPanel({ open, noteId, onClose }: Props) {
    const router = useRouter();

    const note = notes.find((n) => n.id === noteId);

    return (
        <Drawer
            direction="right"
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) onClose();
            }}
        >
            <DrawerContent className="h-full w-40 max-w-full">
                {note ? (
                    <>
                        <DrawerHeader>
                            <DrawerTitle className="text-lg font-semibold">
                                {note.title}
                            </DrawerTitle>
                        </DrawerHeader>

                        {/* Conteúdo scrollável */}
                        <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {note.content}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t p-4 flex justify-between gap-2">
                            <DrawerClose asChild>
                                <Button variant="outline">Fechar</Button>
                            </DrawerClose>

                            <Button
                                variant="outline"
                                onClick={() => router.push(`/note/${note.id}`)}
                            >
                                Abrir em página
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="p-4 text-sm text-muted-foreground">
                        Nenhuma nota selecionada
                    </div>
                )}
            </DrawerContent>
        </Drawer>
    );
}
