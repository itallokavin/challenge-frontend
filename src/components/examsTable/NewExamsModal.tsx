import * as React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress'; // 👈 Novo import para loading
import Alert from '@mui/material/Alert'; // 👈 Novo import para mensagens de erro/sucesso
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { IconComponent } from '../ui/Icons';
import { uploadExamsService } from '@/src/modules/exams/services/exams.service';

interface NewExamModalProps {
  open: boolean;
  onClose: () => void;
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

export const NewExamModal: React.FC<NewExamModalProps> = ({ open, onClose }) => {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [loading, setLoading] = React.useState(false); // 👈 Novo estado de loading
  const [error, setError] = React.useState<string | null>(null); // 👈 Novo estado de erro

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null); // Limpa erros ao selecionar novos arquivos
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    setError(null);
    onClose();
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const result = await uploadExamsService(selectedFiles);
      console.log('Upload concluído:', result);
      
      setSelectedFiles([]);
      onClose();
    
    } catch (err: any) {
      console.error('Erro de Upload:', err);
      const errorMessage = err.response?.data?.message || 'Falha ao conectar com o servidor.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fileLabelText = selectedFiles.length > 0 
    ? `${selectedFiles.length} arquivo(s) selecionado(s)` 
    : 'Selecionar Arquivos';

  return (
    <Modal open={open} onClose={handleCancel} aria-labelledby="modal-title">
      <Box sx={modalStyle}>
        <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
          Upload de Novo Exame
        </Typography>
        
        {/* Exibir mensagem de erro */}
        {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        )}
        
        <Box sx={{ mt: 2, mb: 3 }}>
          <input
            type="file"
            multiple
            accept=".pdf,.dcm" 
            style={{ display: 'none' }}
            id="file-upload-button"
            onChange={handleFileChange}
            key={selectedFiles.length === 0 ? 'empty' : 'files'}
            disabled={loading}
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

        <Box display="flex" justifyContent="space-between" gap={2}>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleCancel} 
            startIcon={<IconComponent.CloseIcon />}
            sx={{ flexGrow: 1 }}
            disabled={loading} // Desabilita o cancelamento durante o upload
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
        </Box>
      </Box>
    </Modal>
  );
};