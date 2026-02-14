"use client";

import { useRef, useEffect } from "react";
import Toolbar from "./toolbar";

export interface Block {
    id: string;
    type: "paragraph";
    content: string;
}

interface BlockEditorProps {
    initialBlocks: Block[];
    onChange: (blocks: Block[]) => void;
}

export default function BlockEditor({
    initialBlocks,
    onChange,
}: BlockEditorProps) {

    const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const activeBlockId = useRef<string | null>(null);

    // 🔥 Sincroniza HTML sem quebrar cursor
    useEffect(() => {
        initialBlocks.forEach((block) => {
            const el = blockRefs.current[block.id];

            if (el && el.innerHTML !== block.content) {
                el.innerHTML = block.content;
            }
        });
    }, [initialBlocks]);

    function updateBlock(id: string, content: string) {
        const updated = initialBlocks.map((block) =>
            block.id === id ? { ...block, content } : block
        );

        onChange(updated);
    }

    // 🔥 FORMATAÇÃO SEM execCommand
    function applyFormat(tag: keyof HTMLElementTagNameMap) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        if (range.collapsed) return;

        const selectedNode = selection.anchorNode as HTMLElement | null;
        if (!selectedNode) return;

        // 🔎 Procura se já está dentro da tag
        let parent = selectedNode.parentElement;

        while (parent && parent.tagName.toLowerCase() !== tag) {
            parent = parent.parentElement;
        }

        // 🔥 SE JÁ ESTIVER FORMATADO → REMOVE
        if (parent && parent.tagName.toLowerCase() === tag) {
            const grandParent = parent.parentNode;

            while (parent.firstChild) {
                grandParent?.insertBefore(parent.firstChild, parent);
            }

            grandParent?.removeChild(parent);
        }
        // 🔥 SE NÃO ESTIVER → APLICA
        else {
            const wrapper = document.createElement(tag);
            wrapper.appendChild(range.extractContents());
            range.insertNode(wrapper);

            range.selectNodeContents(wrapper);
            selection.removeAllRanges();
            selection.addRange(range);
        }

        // Atualiza bloco ativo
        if (activeBlockId.current) {
            const el = blockRefs.current[activeBlockId.current];
            if (el) {
                updateBlock(activeBlockId.current, el.innerHTML);
            }
        }
    }


    function addBlock(afterId: string) {
        const newBlock: Block = {
            id: crypto.randomUUID(),
            type: "paragraph",
            content: "",
        };

        const index = initialBlocks.findIndex((b) => b.id === afterId);
        const updated = [...initialBlocks];
        updated.splice(index + 1, 0, newBlock);

        onChange(updated);

        setTimeout(() => {
            blockRefs.current[newBlock.id]?.focus();
        }, 0);
    }

    function removeBlock(id: string) {
        if (initialBlocks.length === 1) return;

        const index = initialBlocks.findIndex((b) => b.id === id);
        const updated = initialBlocks.filter((b) => b.id !== id);

        onChange(updated);

        const previousBlock = updated[index - 1];
        if (previousBlock) {
            setTimeout(() => {
                blockRefs.current[previousBlock.id]?.focus();
            }, 0);
        }
    }

    function handleKeyDown(
        e: React.KeyboardEvent<HTMLDivElement>,
        block: Block
    ) {
        if (e.key === "Enter") {
            e.preventDefault();
            addBlock(block.id);
        }

        if (e.key === "Backspace" && block.content === "") {
            e.preventDefault();
            removeBlock(block.id);
        }
    }

    return (
        <div className="space-y-3">

            <Toolbar onFormat={applyFormat} />

            <div className="space-y-1">
                {initialBlocks.map((block) => (
                    <div
                        key={block.id}
                        ref={(el) => {
                            blockRefs.current[block.id] = el;
                        }}
                        contentEditable
                        suppressContentEditableWarning
                        className="outline-none min-h-[24px]"
                        onFocus={() => {
                            activeBlockId.current = block.id;
                        }}
                        onInput={(e) =>
                            updateBlock(block.id, e.currentTarget.innerHTML)
                        }
                        onKeyDown={(e) => handleKeyDown(e, block)}
                    />
                ))}
            </div>
        </div>
    );

}
