"use client";

import { useRef, useEffect } from "react";
import Toolbar from "./toolbar";

export interface Block {
    id: string;
    type: "paragraph" | "h1" | "h2" | "h3";
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

    //Aplica cor no texto
    function applyColor(color: string) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        let range = selection.getRangeAt(0);
        if (range.collapsed) return;

        // 🔥 1. Se já estiver dentro de um span com color, remove o wrapper externo
        const startElement =
            range.startContainer.nodeType === Node.TEXT_NODE
                ? range.startContainer.parentElement
                : (range.startContainer as HTMLElement);

        const colorParent = startElement?.closest("span[style*='color']");

        if (colorParent) {
            const parent = colorParent.parentNode;

            while (colorParent.firstChild) {
                parent?.insertBefore(colorParent.firstChild, colorParent);
            }

            parent?.removeChild(colorParent);

            // reajusta seleção após remover wrapper
            selection.removeAllRanges();
            range = document.createRange();
            range.selectNodeContents(parent!);
            selection.addRange(range);
        }

        // 🔥 2. Extrai conteúdo selecionado
        const fragment = range.extractContents();

        const temp = document.createElement("div");
        temp.appendChild(fragment);

        // 🔥 3. Remove qualquer color interno restante
        const spans = temp.querySelectorAll<HTMLSpanElement>("span");

        spans.forEach((el) => {
            if (el.style.color) {
                el.style.color = "";

                if (!el.getAttribute("style")) {
                    const parent = el.parentNode;
                    while (el.firstChild) {
                        parent?.insertBefore(el.firstChild, el);
                    }
                    parent?.removeChild(el);
                }
            }
        });

        // 🔥 4. Cria novo span com a nova cor
        const wrapper = document.createElement("span");
        wrapper.style.color = color;

        while (temp.firstChild) {
            wrapper.appendChild(temp.firstChild);
        }

        range.insertNode(wrapper);

        // 🔥 5. Mantém seleção
        range.selectNodeContents(wrapper);
        selection.removeAllRanges();
        selection.addRange(range);

        // 🔥 6. Atualiza banco
        if (activeBlockId.current) {
            const el = blockRefs.current[activeBlockId.current];
            if (el) {
                updateBlock(activeBlockId.current, el.innerHTML);
            }
        }
    }

    function applyHighlight(color: string) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        let range = selection.getRangeAt(0);
        if (range.collapsed) return;

        // 🔥 1. Se a seleção estiver dentro de um highlight existente, remove o wrapper
        const startElement =
            range.startContainer.nodeType === Node.TEXT_NODE
                ? range.startContainer.parentElement
                : (range.startContainer as HTMLElement);

        const highlightParent = startElement?.closest("span[style*='background-color']");

        if (highlightParent) {
            const parent = highlightParent.parentNode;

            while (highlightParent.firstChild) {
                parent?.insertBefore(highlightParent.firstChild, highlightParent);
            }

            parent?.removeChild(highlightParent);

            // atualizar seleção após remover wrapper
            selection.removeAllRanges();
            range = document.createRange();
            range.selectNodeContents(parent!);
            selection.addRange(range);
        }

        // 🔥 2. Extrai conteúdo selecionado
        const fragment = range.extractContents();

        const temp = document.createElement("div");
        temp.appendChild(fragment);

        // 🔥 3. Remove qualquer background interno restante
        const spans = temp.querySelectorAll<HTMLSpanElement>("span");

        spans.forEach((el) => {
            if (el.style.backgroundColor) {
                el.style.backgroundColor = "";

                if (!el.getAttribute("style")) {
                    const parent = el.parentNode;
                    while (el.firstChild) {
                        parent?.insertBefore(el.firstChild, el);
                    }
                    parent?.removeChild(el);
                }
            }
        });

        // 🔥 4. Cria novo highlight
        const wrapper = document.createElement("span");
        wrapper.style.backgroundColor = color;

        while (temp.firstChild) {
            wrapper.appendChild(temp.firstChild);
        }

        range.insertNode(wrapper);

        // 🔥 5. Mantém seleção
        range.selectNodeContents(wrapper);
        selection.removeAllRanges();
        selection.addRange(range);

        // 🔥 6. Atualiza banco
        if (activeBlockId.current) {
            const el = blockRefs.current[activeBlockId.current];
            if (el) {
                updateBlock(activeBlockId.current, el.innerHTML);
            }
        }
    }

    function cleanColorFromHTML(html: string) {
        const temp = document.createElement("div");
        temp.innerHTML = html;

        const spans = temp.querySelectorAll<HTMLSpanElement>(
            "span[style*='color']"
        );

        spans.forEach((span) => {
            // remove apenas a propriedade color
            span.style.color = "";

            // se não sobrar mais nenhum style → remove o span
            if (!span.getAttribute("style")) {
                const parent = span.parentNode;

                while (span.firstChild) {
                    parent?.insertBefore(span.firstChild, span);
                }

                parent?.removeChild(span);
            }
        });

        return temp.innerHTML;
    }


    function removeColor() {
        if (!activeBlockId.current) return;

        const el = blockRefs.current[activeBlockId.current];
        if (!el) return;

        const cleanedHTML = cleanColorFromHTML(el.innerHTML);

        el.innerHTML = cleanedHTML;

        updateBlock(activeBlockId.current, cleanedHTML);
    }



    function cleanHighlightFromHTML(html: string) {
        const temp = document.createElement("div");
        temp.innerHTML = html;

        const spans = temp.querySelectorAll<HTMLSpanElement>(
            "span[style*='background']"
        );

        spans.forEach((span) => {
            span.style.backgroundColor = "";

            if (span.getAttribute("style") === "") {
                const parent = span.parentNode;
                while (span.firstChild) {
                    parent?.insertBefore(span.firstChild, span);
                }
                parent?.removeChild(span);
            }
        });

        return temp.innerHTML;
    }


    function removeHighlight() {
        if (!activeBlockId.current) return;

        const el = blockRefs.current[activeBlockId.current];
        if (!el) return;

        const cleanedHTML = cleanHighlightFromHTML(el.innerHTML);

        el.innerHTML = cleanedHTML;

        updateBlock(activeBlockId.current, cleanedHTML);
    }

    return (
        <div className="space-y-3">

            <Toolbar
                onFormat={applyFormat}
                onColor={applyColor}
                onRemoveColor={removeColor}
                onHighlight={applyHighlight}
                onRemoveHighlight={removeHighlight}
            />



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