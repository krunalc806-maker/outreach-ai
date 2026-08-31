export type SupportedDocumentType = "pdf" | "docx" | "txt" | "csv" | "xlsx" | "pptx" | "image";

export interface DocumentCapability {
  type: SupportedDocumentType;
  label: string;
  enabled: boolean;
  processing: string;
}

export const DOCUMENT_CAPABILITIES: DocumentCapability[] = [
  { type: "pdf", label: "PDF", enabled: true, processing: "Text extraction and RAG" },
  { type: "docx", label: "Word", enabled: true, processing: "Structured text extraction" },
  { type: "txt", label: "Text", enabled: true, processing: "Direct indexing" },
  { type: "csv", label: "CSV", enabled: true, processing: "Table parsing and analysis" },
  { type: "xlsx", label: "Excel", enabled: true, processing: "Workbook and sheet parsing" },
  { type: "pptx", label: "PowerPoint", enabled: true, processing: "Slide text and notes extraction" },
  { type: "image", label: "Images", enabled: true, processing: "OCR and vision analysis" },
];

export function getDocumentType(filename: string): SupportedDocumentType | null {
  const extension = filename.split(".").pop()?.toLowerCase();
  const map: Record<string, SupportedDocumentType> = { pdf: "pdf", docx: "docx", txt: "txt", csv: "csv", xlsx: "xlsx", xls: "xlsx", pptx: "pptx", png: "image", jpg: "image", jpeg: "image", webp: "image" };
  return extension ? map[extension] ?? null : null;
}
