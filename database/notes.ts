import { Note } from "@/types/note";

export const notes: Note[] = [
  {
    id: "quimica",
    title: "Química",
    content: `
Química estuda a matéria e suas transformações.
Relaciona-se com [[Física]] e [[Biologia]].
    `,
    parentId: null,
  },
  {
    id: "fisica",
    title: "Física",
    content: `
Física estuda as leis do universo.
Base para [[Química]].
    `,
    parentId: null,
  },
  {
    id: "biologia",
    title: "Biologia",
    content: `
Biologia estuda a vida.
Depende de [[Química]].
    `,
    parentId: null,
  },
  {
    id: "celula",
    title: "Celula",
    content: "A célula é a unidade básica da vida [[Biologia]]",
    parentId: "biologia",
  },
  {
    id: "mitose",
    title: "Mitose",
    content: "Processo de divisão celular [[Celula]]",
    parentId: "celula",
  },
];
