"use client";

import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { DocPilotDocument, DocumentType } from "@/types";

function inferType(file: File): DocumentType {
  const mime = file.type;
  if (mime === "application/pdf") return "PDF";
  if (mime.includes("wordprocessingml") || mime === "application/msword") return "WORD";
  if (mime.includes("spreadsheetml") || mime === "application/vnd.ms-excel") return "EXCEL";
  if (mime.includes("presentationml") || mime === "application/vnd.ms-powerpoint") return "POWERPOINT";
  return "IMAGE";
}

interface DocumentStore {
  documents: DocPilotDocument[];
  activeDocumentId: string | null;
  addDocument: (file: File) => DocPilotDocument;
  setStatus: (id: string, status: DocPilotDocument["status"]) => void;
  setActive: (id: string | null) => void;
  removeDocument: (id: string) => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  activeDocumentId: null,

  addDocument: (file: File) => {
    const doc: DocPilotDocument = {
      id: uuid(),
      fileName: file.name,
      fileType: inferType(file),
      sizeBytes: file.size,
      status: "UPLOADED",
      createdAt: new Date().toISOString(),
      file,
    };
    set((state) => ({ documents: [doc, ...state.documents], activeDocumentId: doc.id }));
    return doc;
  },

  setStatus: (id, status) =>
    set((state) => ({
      documents: state.documents.map((d) => (d.id === id ? { ...d, status } : d)),
    })),

  setActive: (id) => set({ activeDocumentId: id }),

  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
      activeDocumentId: state.activeDocumentId === id ? null : state.activeDocumentId,
    })),
}));
