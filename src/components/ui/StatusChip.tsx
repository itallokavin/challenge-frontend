import Typography from "@mui/material/Typography";

interface StatusChipProps {
  status: string;
}

type StatusColor = {
  background: string;
  text: string;
};

const statusStyles: Record<string, StatusColor> = {
  done:       { background: "#D8E9F6", text: "#1976D2" },
  reported:   { background: "#DDF7DD", text: "#4CAF50" },
  pending:    { background: "#DDF7DD", text: "#ffa600ff" },
  processing: { background: "#FFF5E0", text: "#FFA726" },
  error:      { background: "#FDE0E0", text: "#F44336" },
};

export const StatusChip = ({ status }: StatusChipProps) => {
  const statusKey = status.toLowerCase();
  const color = statusStyles[statusKey];
  const label = status.toUpperCase();

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