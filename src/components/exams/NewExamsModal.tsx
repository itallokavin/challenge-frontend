'use client';

import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { IconComponent } from '../ui/Icons';
import { uploadExamsService } from '@/src/modules/exams/services/exams.service';

interface NewExamModalProps {
  open: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export const NewExamModal: React.FC<NewExamModalProps> = ({ open, onClose, onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSelectedFiles([]);
        setError(null);
        setLoading(false);
        if (inputRef.current) {
            inputRef.current.value = ""; 
        }
      }, 200);
    }
  }, [open]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setLoading(true);
    setError(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      await uploadExamsService(selectedFiles);
      
      onUploadSuccess(); 
    
    } catch (err: any) {
      console.error('Erro de Upload:', err);
      const errorMessage = err.response?.data?.message || 'Falha ao conectar com o servidor.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const fileLabelText = selectedFiles.length > 0 
    ? `${selectedFiles.length} arquivo(s) selecionado(s)` 
    : 'Selecionar Arquivos';

  return (
    <Dialog open={open} onClose={loading ? () => {} : onClose} aria-labelledby="modal-title" fullWidth maxWidth="xs">
      <DialogTitle id="modal-title">
        Upload de Novo Exame
      </DialogTitle>
      <DialogContent sx={{ pt: '10px !important' }}>
        {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        )}
        <Box sx={{ mt: 1, mb: 1 }}>
          <input
            type="file"
            multiple
            accept=".pdf,.dcm" 
            style={{ display: 'none' }}
            id="file-upload-button"
            onChange={handleFileChange}
            disabled={loading}
            ref={inputRef}
          />
          <label htmlFor="file-upload-button">
            <Button 
              variant="outlined" 
              component="span" 
              startIcon={loading ? <CircularProgress size={20} /> : <IconComponent.UploadIcon />}
              fullWidth
              sx={{ py: 1.5 }}
              disabled={loading}
            >
              {loading ? 'Enviando...' : fileLabelText}
            </Button>
          </label>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'space-between', gap: 2 }}>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={onClose}
          startIcon={<IconComponent.CloseIcon />}
          sx={{ flexGrow: 1 }}
          disabled={loading}
        >
          Cancelar
        </Button>

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleUpload} 
          disabled={selectedFiles.length === 0 || loading} 
          sx={{ flexGrow: 1 }}
        >
          {loading ? 'Aguarde...' : 'Cadastrar Exame(s)'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};