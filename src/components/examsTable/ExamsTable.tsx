'use client';

import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { ExamsResponseDTO } from "@/src/modules/exams/types/exams.dto";
import { getExamsService } from "@/src/modules/exams/services/exams.service";
import { columnsExamsTable, StatusChip } from "./types/examsTable.types"; 
import { useAuth } from "@/src/modules/auth/hooks/useAuth";
import { Box, Button, IconButton } from "@mui/material";
import { IconComponent } from "../ui/Icons";
import { NewExamModal } from "./NewExamsModal";
import { ReportModal } from "./ReportModal";

export default function ExamsTable() {
  const [exams, setExams] = React.useState<ExamsResponseDTO[]>([]);
  const [page, setPage] = React.useState(0);

  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);
  const [selectedExamId, setSelectedExamId] = React.useState<string | null>(null);
  
  const {user} = useAuth();

  const POLLING_INTERVAL = Number(process.env.NEXT_PUBLIC_POLLING_INTERVAL);

  const fetchExams = React.useCallback(() => {
    getExamsService()
      .then((data: any) => {
        if (Array.isArray(data)) {
          setExams(data);
        } else if (Array.isArray(data?.data)) {
          setExams(data.data);
        } else {
          console.warn("Formato inesperado:", data);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar exames:", error);
      });
  }, []);

  React.useEffect(() => {
    fetchExams(); 
    const intervalId = setInterval(fetchExams, POLLING_INTERVAL);
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchExams]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNewExam = () => {
    handleOpenModal();
  };

  const handleOpenReportModal = (examId: string) => {
    setSelectedExamId(examId);
    setIsReportModalOpen(true);
  };
  
  const handleViewExam = (examImagePath: string) => {
    const viewUrl = `${process.env.NEXT_PUBLIC_API_URL}/files/${examImagePath}`;
    window.open(viewUrl, '_blank');
  };
  
  const handleReportSuccess = () => {
      setIsReportModalOpen(false);
      fetchExams(); 
  }

  return (
    <div className="pt-4">
        <Box 
          display="flex" 
          justifyContent="flex-end"
          mb={2}
        >
        {user?.role === 'ATTENDANT' && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<IconComponent.UploadIcon />}
            onClick={handleNewExam}
            sx={{ fontWeight: 'bold' }}
          >
            Cadastrar Exame
          </Button>
        )}
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="tabela de exames">
            <TableHead>
              <TableRow>
                {columnsExamsTable
                .filter(column => column.id !== 'actions' || user?.role === 'DOCTOR') 
                .map((column) => (
                    <TableCell
                        key={column.id}
                        style={{ minWidth: column.minWidth }}
                        align={column.align}
                        sx={{
                            backgroundColor: "#F7F7F7",
                            fontWeight: "bold",
                            color: '#606060',
                            textTransform: 'uppercase',
                            fontSize: '0.8rem'
                        }}
                        >
                        {column.label}
                    </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
                {exams.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={columnsExamsTable.length} align="center">
                    <Typography variant="subtitle1" sx={{ padding: '20px', color: '#888' }}>
                    Nenhum exame cadastrado
                    </Typography>
                    </TableCell>
                    </TableRow>
                ) : (
                        // Renderização dos dados
                        exams
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((exam) => (
                        <TableRow hover role="checkbox" tabIndex={-1} key={exam.id}>
                        {columnsExamsTable
                                        // 🛑 APLICAÇÃO DO FILTRO AQUI
                                        .filter(column => column.id !== 'actions' || user?.role === 'DOCTOR')
                                        .map((column) => {
                            // O DTO ExamsResponseDTO não tem 'actions', então tratamos separadamente.
                            const value = column.id !== 'actions' ? exam[column.id as keyof ExamsResponseDTO] : null;

                            return (
                            <TableCell key={column.id} align={column.align}>
                                {/* 🛑 AÇÕES: Visível apenas para DOCTOR */}
                                {column.id === "actions" && user?.role === 'DOCTOR' ? (
                                <Box display="flex" justifyContent="center" gap={1}>
                                {/* 1. Botão para Escrever Laudo (abre modal) */}
                                <IconButton 
                                color="primary" 
                                size="small"
                                title="Escrever Laudo"
                                onClick={() => handleOpenReportModal(exam.id)}
                                >
                                <IconComponent.EditIcon fontSize="small" />
                                </IconButton>
                                
                                {/* 2. Botão para Visualizar Exame (abre nova aba) */}
                                <IconButton 
                                color="default" 
                                size="small"
                                title="Visualizar Exame"
                                onClick={() => handleViewExam(exam.imagePath)} 
                                >
                                <IconComponent.VisibilityIcon fontSize="small" />
                                </IconButton>
                                </Box>

                            ) : column.id === "status" ? (
                                <StatusChip status={String(value)} />
                            ) : column.id === "createdAt" ? (
                                value ? new Date(value as string).toLocaleString("pt-BR", {
                                year: 'numeric', month: 'numeric', day: 'numeric', 
                                hour: '2-digit', minute: '2-digit'
                                }) : "---"
                            ) : (
                                value || "---" 
                            )}
                            </TableCell>
                            );
                            })}
                        </TableRow>
                        ))
                        )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* A paginação é exibida apenas se houver dados */}
        {exams.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={exams.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={"Linhas por página:"}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
            }
          />
        )}
      </Paper>
      <NewExamModal 
          open={isModalOpen} 
          onClose={handleCloseModal} 
      />
      <ReportModal
        open={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        examId={selectedExamId}
        onReportSuccess={handleReportSuccess}
      />
    </div>
  );
}