"use client";

import { useRef } from "react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function RichTextEditor({
    value,
    onChange,
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);

    function formatText(command: string) {
        editorRef.current?.focus();
        document.execCommand(command, false);
    }

    return (
        <div>
            {/* Toolbar */}
            <div className="flex gap-2 mb-4 border p-2 rounded bg-gray-50">
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        formatText("bold");
                    }}
                    className="px-2 font-bold"
                >
                    B
                </button>

                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        formatText("italic");
                    }}
                    className="px-2 italic"
                >
                    I
                </button>

                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        formatText("underline");
                    }}
                    className="px-2 underline"
                >
                    U
                </button>

                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        formatText("strikeThrough");
                    }}
                    className="px-2 line-through"
                >
                    S
                </button>

                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        formatText("subscript");
                    }}
                    className="px-2"
                >
                    X₂
                </button>

                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        formatText("superscript");
                    }}
                    className="px-2"
                >
                    X²
                </button>
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="w-full min-h-40 outline-none text-sm leading-relaxed border p-4 rounded"
                dangerouslySetInnerHTML={{ __html: value }}
                onInput={(e) => onChange(e.currentTarget.innerHTML)}
            />
        </div>
    );
}
