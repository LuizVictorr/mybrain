import { GraphData } from "@/types/graph";

export const graphData: GraphData = {
    nodes: [
        { id: "1", title: "Home", content: "oi" },
        { id: "2", title: "Química", content: "tudo bem" },
        { id: "3", title: "Engenharia", content: "tudo sim" },
        { id: "4", title: "Projetos", content: "e voce" },
    ],
    links: [
        { source: "1", target: "2" },
        { source: "2", target: "3" },
        { source: "3", target: "4" },
        { source: "1", target: "4" }
    ]
};
