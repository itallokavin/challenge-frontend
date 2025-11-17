import { api } from "../../shared/services/api/axios";
import { ExamsResponseDTO } from "../types/exams.dto";

export async function getExamsService(): Promise<ExamsResponseDTO> {
  const response = await api.get<ExamsResponseDTO>("/exams", {
    withCredentials: true,
  });
  return response.data;
}

export async function uploadExamsService(files: File[]): Promise<any> {
  const formData = new FormData();

  files.forEach(file => {
    formData.append('files', file); 
  });
  
  const response = await api.post("/exams/upload", formData, {
    withCredentials: true,
  });

  return response.data;
}
