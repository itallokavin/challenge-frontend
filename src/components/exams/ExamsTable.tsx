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
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { ExamsResponseDTO } from "@/src/modules/exams/types/exams.dto";
import { columnsExamsTable, Column } from "./examsTable.config"; 
import { useAuth } from "@/src/modules/auth/hooks/useAuth";
import { useExams } from "@/src/modules/exams/hooks/useExams";
import { usePagination } from "@/src/hooks/usePagination";
import { useModal } from "@/src/hooks/useModal";
import { IconComponent } from "../ui/Icons";
import { NewExamModal } from "./NewExamsModal";
import { ReportModal } from "./ReportModal";
import { StatusChip } from "../ui/StatusChip";

export default function ExamsTable() {
    const { user } = useAuth();
    const { exams, fetchExams } = useExams();
    const { 
      page, 
      rowsPerPage, 
      handleChangePage, 
      handleChangeRowsPerPage, 
      sliceRange 
    } = usePagination(10);

    const { 
      isOpen: isNewExamModalOpen, 
      open: openNewExamModal, 
      close: closeNewExamModal 
    } = useModal();

    const { 
      isOpen: isReportModalOpen, 
      open: openReportModal, 
      close: closeReportModal,
      data: selectedExamId
    } = useModal<string>();

    const [snackbar, setSnackbar] = React.useState<{ message: string; severity: "success" | "error" } | null>(null);

    const filteredColumns = React.useMemo(() => {
        return columnsExamsTable.filter(
            column => column.id !== 'actions' || user?.role === 'DOCTOR'
        );
    }, [user?.role]);

    const handleViewExam = (examImagePath: string) => {
        const viewUrl = `${process.env.NEXT_PUBLIC_API_URL}/files/${examImagePath}`;
        window.open(viewUrl, '_blank');
    };

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackbar(null);
    };

    const handleUploadSuccess = () => {
        closeNewExamModal();
        fetchExams(); 
        setSnackbar({ message: "Exame(s) cadastrado(s) com sucesso!", severity: "success" });
    }

    const handleReportSuccess = () => {
        closeReportModal();
        fetchExams(); 
        setSnackbar({ message: "Laudo enviado com sucesso!", severity: "success" });
    }

    const renderCellContent = (column: Column, exam: ExamsResponseDTO) => {
        const value = column.id !== 'actions' ? exam[column.id as keyof ExamsResponseDTO] : null;

        if (column.id === "actions") {
            return (
                <Box display="flex" justifyContent="center" gap={1}>
                    <IconButton 
                        color="primary" 
                        size="small"
                        title="Escrever Laudo"
                        onClick={() => openReportModal(exam.id)}
                    >
                        <IconComponent.EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                        color="default" 
                        size="small"
                        title="Visualizar Exame"
                        onClick={() => handleViewExam(exam.imagePath)} 
                    >
                        <IconComponent.VisibilityIcon fontSize="small" />
                    </IconButton>
                </Box>
            );
        }

        if (column.id === "status") {
            return <StatusChip status={String(value)} />;
        }

        if (column.id === "createdAt") {
            return value ? new Date(value as string).toLocaleString("pt-BR", {
                year: 'numeric', month: 'numeric', day: 'numeric', 
                hour: '2-digit', minute: '2-digit'
            }) : "---";
        }

        return value || "---";
    };

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
                    onClick={() => openNewExamModal()}
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
                                {filteredColumns.map((column) => (
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
                                <TableCell colSpan={filteredColumns.length} align="center">
                                <Typography variant="subtitle1" sx={{ padding: '20px', color: '#888' }}>
                                Nenhum exame cadastrado
                                </Typography>
                                </TableCell>
                                </TableRow>
                            ) : (
                                exams
                                .slice(sliceRange[0], sliceRange[1])
                                .map((exam) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={exam.id}>
                                        {filteredColumns.map((column) => (
                                            <TableCell key={column.id} align={column.align}>
                                                {renderCellContent(column, exam)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
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
                open={isNewExamModalOpen} 
                onClose={closeNewExamModal}
                onUploadSuccess={handleUploadSuccess} 
            />
            <ReportModal
                open={isReportModalOpen}
                onClose={closeReportModal}
                examId={selectedExamId || null}
                onReportSuccess={handleReportSuccess}
            />

            <Snackbar
                open={!!snackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                {snackbar ? (
                    <Alert 
                        onClose={handleCloseSnackbar} 
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                ) : undefined} 
            </Snackbar>
        </div>
    );
}