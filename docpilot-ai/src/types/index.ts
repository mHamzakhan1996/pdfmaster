export type DocumentType = "PDF" | "WORD" | "EXCEL" | "POWERPOINT" | "IMAGE";
export type DocumentStatus = "UPLOADED" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface DocPilotDocument {
  id: string;
  fileName: string;
  fileType: DocumentType;
  sizeBytes: number;
  status: DocumentStatus;
  pageCount?: number;
  createdAt: string;
  file?: File; // kept client-side for in-browser processing
}

export interface ToolDefinition {
  id: string;
  category: "pdf" | "ai";
  title: string;
  description: string;
  icon: string;
  acceptTypes: DocumentType[];
  endpoint?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}
