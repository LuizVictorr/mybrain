"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import Image from "next/image";

interface ToolbarProps {
    onFormat: (tag: keyof HTMLElementTagNameMap) => void;
    onColor: (color: string) => void;
    onRemoveColor: () => void;
    onHighlight: (color: string) => void;
    onRemoveHighlight: () => void;
    onChangeBlockType: (id: string, type: "paragraph" | "h1" | "h2" | "h3" | "ul" | "ol") => void;
    activeBlockId: string | null;
    onInsertImage: (url: string) => void;
    insertYouTubeVideo: (url: string) => void;

}



export default function Toolbar({
    onFormat,
    onColor,
    onRemoveColor,
    onHighlight,
    onRemoveHighlight,
    onChangeBlockType,
    activeBlockId,
    onInsertImage,
    insertYouTubeVideo,
}: ToolbarProps) {

    const defaultColors = [
        "#000000",
        "#ef4444",
        "#f97316",
        "#eab308",
        "#22c55e",
        "#3b82f6",
        "#8b5cf6",
        "#ec4899",
    ];

    const [open, setOpen] = useState(false);
    const [highlightOpen, setHighlightOpen] = useState(false);
    const [fontSizeOpen, setFontSizeOpen] = useState(false);
    const [videoDialogOpen, setVideoDialogOpen] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");


    const [link, setLink] = useState("");

    function handleInsert() {
        if (!link) return;

        const converted = convertDriveLink(link);
        onInsertImage(converted);
        setLink("");
    }

    function convertDriveLink(url: string) {
        const match = url.match(/\/d\/(.*?)\//);
        if (!match) return url;

        const fileId = match[1];
        return `https://lh3.googleusercontent.com/d/${fileId}`;
    }

    function getYoutubeEmbedUrl(url: string): string | null {
        try {
            const parsed = new URL(url);

            if (parsed.hostname.includes("youtube.com")) {
                const videoId = parsed.searchParams.get("v");
                if (!videoId) return null;
                return `https://www.youtube.com/embed/${videoId}`;
            }

            if (parsed.hostname.includes("youtu.be")) {
                const videoId = parsed.pathname.replace("/", "");
                if (!videoId) return null;
                return `https://www.youtube.com/embed/${videoId}`;
            }

            return null;
        } catch {
            return null;
        }
    }



    return (
        <div className="flex gap-2 border rounded p-2 sticky top-0 z-10">

            <ToolbarButton label="B" tag="strong" onFormat={onFormat} />
            <ToolbarButton label="I" tag="em" onFormat={onFormat} />
            <ToolbarButton label="U" tag="u" onFormat={onFormat} />
            <ToolbarButton label="S" tag="s" onFormat={onFormat} />
            <ToolbarButton label="X₂" tag="sub" onFormat={onFormat} />
            <ToolbarButton label="X²" tag="sup" onFormat={onFormat} />

            {/* SIZE POPOVER */}
            <Popover open={fontSizeOpen} onOpenChange={setFontSizeOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" onMouseDown={(e) => e.preventDefault()}>
                        🔠 Tamanho
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="space-x-2 space-y-2">
                    {['paragraph', 'h1', 'h2', 'h3', 'ul', 'ol'].map((t) => (
                        <Button
                            key={t}
                            variant="ghost"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                                if (activeBlockId) {
                                    onChangeBlockType(activeBlockId, t as "paragraph" | "h1" | "h2" | "h3" | "ul" | "ol");
                                }
                            }}
                            className="px-2 py-1 border rounded hover:bg-muted transition"
                        >
                            {t.toUpperCase()}
                        </Button>
                    ))}
                </PopoverContent>
            </Popover>

            {/* COLOR POPOVER */}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        🎨 Color
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="w-72 space-y-4"
                    side="bottom"
                    align="start"
                >

                    {/* 🎨 Default Colors */}
                    <div className="flex flex-wrap gap-2">
                        {defaultColors.map((color) => (
                            <button
                                key={color}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => onColor(color)}
                                className="w-7 h-7 rounded border hover:scale-105 transition"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>


                    {/* 🧼 Remove Color */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full rounded border"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={onRemoveColor}
                    >
                        Remover cor
                    </Button>

                </PopoverContent>
            </Popover>

            {/* HIGHLIGHT POPOVER */}
            <Popover open={highlightOpen} onOpenChange={setHighlightOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        🖍 Highlight
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="w-72 space-y-4"
                    side="bottom"
                    align="start"
                >
                    {/* Cores padrão */}
                    <div className="flex flex-wrap gap-2">
                        {defaultColors.map((color) => (
                            <button
                                key={color}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => onHighlight(color)}
                                className="w-7 h-7 rounded border hover:scale-105 transition"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full rounded border"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={onRemoveHighlight}
                    >
                        Remover highlight
                    </Button>
                </PopoverContent>
            </Popover>

            {/* IMAGE DIALOG */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                    >
                        🖼️ Imagem
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Inserir imagem do Drive</DialogTitle>
                    </DialogHeader>

                    <Input
                        placeholder="Cole o link do Google Drive"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />

                    <Button onClick={handleInsert}>
                        Inserir
                    </Button>
                </DialogContent>
            </Dialog>

            {/* VIDEO DIALOG */}
            <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                    >
                        📽️ Video
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Inserir vídeo do YouTube</DialogTitle>
                    </DialogHeader>

                    <Input
                        placeholder="Cole o link do YouTube"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                    />

                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setVideoDialogOpen(false);
                                setVideoUrl("");
                            }}
                        >
                            Cancelar
                        </Button>

                        <Button
                            onClick={() => {
                                insertYouTubeVideo(videoUrl);
                                setVideoDialogOpen(false);
                                setVideoUrl("");
                            }}
                        >
                            Inserir
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}

interface ToolbarButtonProps {
    label: string;
    tag: keyof HTMLElementTagNameMap;
    onFormat: (tag: keyof HTMLElementTagNameMap) => void;
}

function ToolbarButton({ label, tag, onFormat }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onFormat(tag)}
            className="px-2 py-1 border rounded hover:bg-muted transition"
        >
            {label}
        </button>
    );
}
