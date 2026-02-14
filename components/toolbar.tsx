"use client";

interface ToolbarProps {
    onFormat: (tag: keyof HTMLElementTagNameMap) => void;
}

export default function Toolbar({ onFormat }: ToolbarProps) {
    return (
        <div className="flex gap-2 border rounded p-2 bg-gray-50 sticky top-0 z-10">

            <ToolbarButton label="B" tag="strong" onFormat={onFormat} />
            <ToolbarButton label="I" tag="em" onFormat={onFormat} />
            <ToolbarButton label="U" tag="u" onFormat={onFormat} />
            <ToolbarButton label="S" tag="s" onFormat={onFormat} />
            <ToolbarButton label="X₂" tag="sub" onFormat={onFormat} />
            <ToolbarButton label="X²" tag="sup" onFormat={onFormat} />

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
            onMouseDown={(e) => e.preventDefault()} // mantém foco
            onClick={() => onFormat(tag)}
            className="px-2 py-1 border rounded hover:bg-gray-200"
        >
            {label}
        </button>
    );
}
