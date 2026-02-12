export function extractLinks(content: string): string[] {
    const regex = /\[\[(.*?)\]\]/g;
    const links: string[] = [];

    let match;
    while ((match = regex.exec(content)) !== null) {
        links.push(match[1]);
    }

    return links;
}
