"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface ToolbarProps {
    onFormat: (tag: keyof HTMLElementTagNameMap) => void;
    onColor: (color: string) => void;
    onRemoveColor: () => void;
    onHighlight: (color: string) => void;
    onRemoveHighlight: () => void;
}


export default function Toolbar({
    onFormat,
    onColor,
    onRemoveColor,
    onHighlight,
    onRemoveHighlight
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


    return (
        <div className="flex gap-2 border rounded p-2 sticky top-0 z-10">

            <ToolbarButton label="B" tag="strong" onFormat={onFormat} />
            <ToolbarButton label="I" tag="em" onFormat={onFormat} />
            <ToolbarButton label="U" tag="u" onFormat={onFormat} />
            <ToolbarButton label="S" tag="s" onFormat={onFormat} />
            <ToolbarButton label="X₂" tag="sub" onFormat={onFormat} />
            <ToolbarButton label="X²" tag="sup" onFormat={onFormat} />

            {/* 🎨 COLOR POPOVER */}
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

            {/* 🖍 HIGHLIGHT POPOVER */}
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
