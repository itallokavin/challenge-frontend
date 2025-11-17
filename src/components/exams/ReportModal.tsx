'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { api } from "@/src/modules/shared/services/api/axios";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  examId: string | null;
  onReportSuccess: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ open, onClose, examId, onReportSuccess }) => {
  const [reportText, setReportText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmitReport = async () => {
    if (!examId || !reportText.trim()) return;

    setLoading(true);
    setError(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      await api.post(`/exams/${examId}/report`, { report: reportText }); 
    
      onReportSuccess();

    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao enviar o laudo.');
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setReportText('');
        setError(null);
        setLoading(false);
      }, 200);
    }
  }, [open]);

  return (
    <Dialog 
      open={open} 
      onClose={loading ? () => {} : onClose} 
      aria-labelledby="report-modal-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="report-modal-title">
        Laudo do Exame {examId}
      </DialogTitle>
    
      <DialogContent>
        {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        )}
        
        <TextField
          autoFocus
          label="Escreva o Laudo"
          multiline
          rows={6}
          fullWidth
          variant="outlined"
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          sx={{ mt: 1 }}
          disabled={loading}
        />
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
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
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Enviando...' : 'Salvar Laudo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};