import { api } from "../../shared/services/api/axios";
import { LoginDTO, AuthResponse } from "../types/auth.types";

export async function loginService(data: LoginDTO): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
}
