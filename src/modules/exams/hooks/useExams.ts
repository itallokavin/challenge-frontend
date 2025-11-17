import React from "react";
import { getExamsService } from "../services/exams.service";
import { ExamsResponseDTO } from "../types/exams.dto";
import { useAuth } from "../../auth/hooks/useAuth";

const POLLING_INTERVAL = Number(process.env.NEXT_PUBLIC_POLLING_INTERVAL);

export const useExams = () => {
  const [exams, setExams] = React.useState<ExamsResponseDTO[]>([]);
  const { user } = useAuth();

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
    if (user) { 
      fetchExams();
      const intervalId = setInterval(fetchExams, POLLING_INTERVAL);

      return () => {
        clearInterval(intervalId);
      };
    } else {
        setExams([]);
    }
  }, [fetchExams, user]);

  return { exams, fetchExams };
};