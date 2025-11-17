import { ExamsResponseDTO } from "@/src/modules/exams/types/exams.dto";
import Typography from "@mui/material/Typography";

interface Column {
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

interface StatusChipProps {
  status: string;
}

export const StatusChip = ({ status }: StatusChipProps) => {
  let color = {
    background: "#f0f0f0",
    text: "#000000",
  };
  let label = status.toUpperCase();

  switch (status.toLowerCase()) {
    case "done":
      color = { background: "#D8E9F6", text: "#1976D2" };
      break;
    case "reported":
      color = { background: "#DDF7DD", text: "#4CAF50" };
      break;
    case "pending":
      color = { background: "#DDF7DD", text: "#ffa600ff" };
      break;
    case "processing":
      color = { background: "#FFF5E0", text: "#FFA726" };
      break;
    case "error":
      color = { background: "#FDE0E0", text: "#F44336" };
      break;
    default:
      break;
  }

  return (
    <Typography 
      sx={{
        backgroundColor: color.background,
        color: color.text,
        padding: "4px 8px",
        borderRadius: "16px",
        fontWeight: 'bold',
        fontSize: '0.75rem',
        display: 'inline-block',
        textAlign: 'center'
      }}
    >
      {label}
    </Typography>
  );
};