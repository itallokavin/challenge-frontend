import { ExamsResponseDTO } from "@/src/modules/exams/types/exams.dto";

export interface Column {
  id: keyof ExamsResponseDTO | 'actions';
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
}

export const columnsExamsTable: readonly Column[] = [
  { id: "id", label: "ID", minWidth: 60 },
  { id: "title", label: "TÍTULO", minWidth: 60 },
  { id: "processingResult", label: "RESULTADO PROCESSAMENTO", minWidth: 200 },
  { id: "status", label: "STATUS", minWidth: 120, align: "center" },
  { id: "report", label: "LAUDO", minWidth: 150 }, 
  { id: "createdAt", label: "CRIADO EM", minWidth: 150 },
  { id: "actions", label: "AÇÕES", minWidth: 150, align: "center" },
];

