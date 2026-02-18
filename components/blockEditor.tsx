"use client";

import { useRef, useEffect, ElementType } from "react";
import Toolbar from "./toolbar";
import Image from "next/image";

export interface Block {
    id: string;
    type: "paragraph" | "h1" | "h2" | "h3" | "ul" | "ol";
    content: string; // para listas, content será innerHTML das <li>
    sizeClass?: string; // para controlar tamanho do texto
}




interface BlockEditorProps {
    initialBlocks: Block[];
    onChange: (blocks: Block[]) => void;
}

export default function BlockEditor({
    initialBlocks,
    onChange,
}: BlockEditorProps) {

    const blockRefs = useRef<Record<string, HTMLElement | null>>({});
    const activeBlockId = useRef<string | null>(null);
    const savedRange = useRef<Range | null>(null);

    // 🔥 Sincroniza HTML sem quebrar cursor
    useEffect(() => {
        initialBlocks.forEach((block) => {
            const el = blockRefs.current[block.id];

            if (el && el.innerHTML !== block.content) {
                el.innerHTML = block.content;

                const images = el.querySelectorAll("img");
                images.forEach((img) => {
                    enableImageResize(img as HTMLImageElement, block.id);
                });
            }
        });
    }, [initialBlocks]);


    function changeBlockType(id: string, type: Block['type']) {
        const updated = initialBlocks.map((block) =>
            block.id === id ? { ...block, type } : block
        );
        onChange(updated);
    }


    function updateBlock(id: string, content: string) {
        const updated = initialBlocks.map((block) =>
            block.id === id ? { ...block, content } : block
        );

        onChange(updated);
    }

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

    function addBlock(afterId: string, type?: Block['type']) {
        const currentBlock = initialBlocks.find(b => b.id === afterId);
        const newBlock: Block = {
            id: crypto.randomUUID(),
            type: type || currentBlock?.type || "paragraph",
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
        e: React.KeyboardEvent<HTMLElement>,
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

    function enableImageResize(img: HTMLImageElement, blockId: string) {
        // Se já estiver dentro de wrapper, não recria
        if (img.parentElement?.classList.contains("image-wrapper")) return;

        // 🔥 Cria wrapper
        const wrapper = document.createElement("div");
        wrapper.className = "image-wrapper";
        wrapper.style.position = "relative";
        wrapper.style.display = "inline-block";

        img.parentNode?.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        // 🔥 Cria handle
        const handle = document.createElement("div");
        handle.className = "image-resize-handle";
        handle.style.width = "10px";
        handle.style.height = "10px";
        handle.style.background = "black";
        handle.style.position = "absolute";
        handle.style.right = "-15px";
        handle.style.bottom = "-6px";
        handle.style.cursor = "se-resize";
        handle.style.borderRadius = "2px";
        handle.style.opacity = "0.8";


        wrapper.appendChild(handle);

        let startX = 0;
        let startWidth = 0;

        handle.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();

            startX = e.clientX;
            startWidth = img.offsetWidth;

            function onMouseMove(ev: MouseEvent) {
                const diff = ev.clientX - startX;
                const newWidth = Math.max(100, startWidth + diff);
                img.style.width = `${newWidth}px`;
            }

            function onMouseUp() {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);

                const el = blockRefs.current[blockId];
                if (el) {
                    updateBlock(blockId, el.innerHTML);
                }
            }

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });
    }

    function insertImage(url: string) {
        if (!activeBlockId.current) return;

        const el = blockRefs.current[activeBlockId.current];
        if (!el) return;

        if (!savedRange.current) return;

        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(savedRange.current);

        const img = document.createElement("img");
        img.src = url;
        img.className = "my-4 rounded-xl max-w-full";
        img.style.width = "300px";

        savedRange.current.insertNode(img);

        enableImageResize(img, activeBlockId.current);

        // move cursor depois da imagem
        savedRange.current.setStartAfter(img);
        savedRange.current.setEndAfter(img);
        selection?.removeAllRanges();
        selection?.addRange(savedRange.current);

        updateBlock(activeBlockId.current, el.innerHTML);
    }

    function enableVideoResize(wrapper: HTMLDivElement, blockId: string) {
        if (wrapper.querySelector(".video-resize-handle")) return;

        wrapper.style.position = "relative";
        wrapper.style.display = "inline-block";

        const handle = document.createElement("div");
        handle.className = "video-resize-handle";
        handle.style.width = "10px";
        handle.style.height = "10px";
        handle.style.background = "black";
        handle.style.position = "absolute";
        handle.style.right = "-15px";
        handle.style.bottom = "-15px";
        handle.style.cursor = "se-resize";
        handle.style.borderRadius = "2px";
        handle.style.opacity = "0.8";

        wrapper.appendChild(handle);

        let startX = 0;
        let startWidth = 0;

        handle.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();

            startX = e.clientX;
            startWidth = wrapper.offsetWidth;

            function onMouseMove(ev: MouseEvent) {
                const diff = ev.clientX - startX;
                const newWidth = Math.max(200, startWidth + diff);

                const newHeight = (newWidth * 9) / 16; // 🔥 mantém 16:9

                wrapper.style.width = `${newWidth}px`;
                wrapper.style.height = `${newHeight}px`;
            }

            function onMouseUp() {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);

                const el = blockRefs.current[blockId];
                if (el) {
                    updateBlock(blockId, el.innerHTML);
                }
            }

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });
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

    function insertYouTubeVideo(url: string) {
        if (!activeBlockId.current) return;

        const el = blockRefs.current[activeBlockId.current];
        if (!el) return;

        if (!savedRange.current) return;

        const embedUrl = getYoutubeEmbedUrl(url);
        if (!embedUrl) {
            alert("Link inválido do YouTube");
            return;
        }

        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(savedRange.current);

        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        wrapper.style.width = "533px";  // 16:9 proporcional
        wrapper.style.height = "300px";
        wrapper.style.margin = "16px 0";


        const iframe = document.createElement("iframe");
        iframe.src = embedUrl;
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.style.borderRadius = "12px";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;

        wrapper.appendChild(iframe);

        enableVideoResize(wrapper, activeBlockId.current);

        savedRange.current.insertNode(wrapper);

        savedRange.current.setStartAfter(wrapper);
        savedRange.current.setEndAfter(wrapper);
        selection?.removeAllRanges();
        selection?.addRange(savedRange.current);

        updateBlock(activeBlockId.current, el.innerHTML);
    }

    return (
        <div className="space-y-3">

            <Toolbar
                onFormat={applyFormat}
                onColor={applyColor}
                onRemoveColor={removeColor}
                onHighlight={applyHighlight}
                onRemoveHighlight={removeHighlight}
                onChangeBlockType={changeBlockType}
                activeBlockId={activeBlockId.current}
                onInsertImage={insertImage}
                insertYouTubeVideo={insertYouTubeVideo}
            />

            <div className="space-y-1">
                {initialBlocks.map((block) => {
                    // Escolhe o elemento correto
                    const Tag: React.ElementType =
                        block.type === "paragraph" ? "div" :
                            block.type === "ul" || block.type === "ol" ? block.type :
                                block.type;

                    const fontSizeClass =
                        block.type === "paragraph" ? "text-base" :
                            block.type === "h3" ? "text-xl" :
                                block.type === "h2" ? "text-2xl" :
                                    block.type === "h1" ? "text-3xl" :
                                        "text-base";

                    // Classes para listas
                    const listClass =
                        block.type === "ul" ? "list-inside list-disc" :
                            block.type === "ol" ? "list-inside list-decimal" :
                                "";

                    return (
                        <Tag
                            key={block.id}
                            ref={(el: HTMLElement | null) => { blockRefs.current[block.id] = el; }}
                            contentEditable
                            suppressContentEditableWarning
                            className={`outline-none min-h-6 ${fontSizeClass} ${listClass}`}
                            onFocus={() => { activeBlockId.current = block.id; }}
                            onInput={(e: React.FormEvent<HTMLElement>) =>
                                updateBlock(block.id, (e.target as HTMLElement).innerHTML)
                            }
                            onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
                                handleKeyDown(e, block)
                            }
                            onMouseUp={() => {
                                const selection = window.getSelection();
                                if (selection && selection.rangeCount > 0) {
                                    savedRange.current = selection.getRangeAt(0);
                                }
                            }}
                            onKeyUp={() => {
                                const selection = window.getSelection();
                                if (selection && selection.rangeCount > 0) {
                                    savedRange.current = selection.getRangeAt(0);
                                }
                            }}


                        >
                            {(block.type === "ul" || block.type === "ol") && !block.content && (
                                <li><br /></li>
                            )}
                        </Tag>

                    );
                })}

            </div>

        </div>
    );

}