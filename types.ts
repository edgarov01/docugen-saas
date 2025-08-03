
export interface User {
  id: string;
  email: string;
}

export interface Placeholder {
  key: string; // e.g., "{{clientName}}"
  label: string; // e.g., "Client Name"
  type: 'text' | 'date' | 'number'; // For dynamic form generation
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  fileName: string; // Original uploaded file name
  uploadDate: string;
  placeholders: Placeholder[]; // Recognized placeholders
}

export type DataRow = Record<string, string | number | boolean>; // Key is placeholder.key

export enum JobStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

export interface GenerationJob {
  id: string;
  templateId: string;
  templateName: string;
  status: JobStatus;
  progress: number; // 0-100
  createdAt: string;
  itemCount: number; // For bulk jobs
  generatedDocumentIds?: string[]; // IDs of generated documents
  errorMessage?: string;
}

export interface GeneratedDocument {
  id: string;
  jobId?: string; // If part of a bulk job
  templateName: string;
  fileName: string; // e.g., "Contract_ClientX_2023-10-26.docx"
  createdAt: string;
  downloadUrl: string; // Mock URL
}

export interface BreadcrumbItem {
  name: string;
  path?: string;
}
