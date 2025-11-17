// src/components/ReportModal.tsx

import * as React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { api } from "@/src/modules/shared/services/api/axios"; // Assumindo import do Axios

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  examId: string | null;
  onReportSuccess: () => void;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

export const ReportModal: React.FC<ReportModalProps> = ({ open, onClose, examId, onReportSuccess }) => {
  const [reportText, setReportText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmitReport = async () => {
    if (!examId || !reportText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // 📝 Chamada PATCH para enviar o laudo para /exams/:id/report
      await api.post(`/exams/${examId}/report`, { report: reportText }); 
      
      onReportSuccess(); // Notifica a tabela para atualizar (polling pode ajudar)
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao enviar o laudo.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
      // Limpa o texto ao abrir um novo exame
      if (open) {
          setReportText('');
          setError(null);
      }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="report-modal-title">
      <Box sx={{ ...modalStyle, width: 600 }}> {/* Modal um pouco maior */}
        <Typography id="report-modal-title" variant="h6" component="h2" gutterBottom>
          Laudo do Exame {examId}
        </Typography>

        {/* ... (Exibir erro se houver) ... */}

        <TextField
          label="Escreva o Laudo"
          multiline
          rows={6}
          fullWidth
          variant="outlined"
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          sx={{ mb: 2 }}
          disabled={loading}
        />

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button 
            variant="outlined" 
            onClick={onClose} 
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitReport}
            disabled={loading || reportText.trim().length === 0}
          >
            {loading ? 'Enviando...' : 'Salvar Laudo'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};