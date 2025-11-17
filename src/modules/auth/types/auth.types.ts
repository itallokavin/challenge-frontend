export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'ATTENDANT' | 'DOCTOR' | string;
  };
}
