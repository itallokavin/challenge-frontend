// shared/services/api/axios.ts

import axios from "axios";

// Função auxiliar para ler o cookie 'access_token'
function getAccessToken() {
  if (typeof document === 'undefined') {
    return null; // Evita falhas em ambientes sem o objeto 'document' (como o servidor)
  }
  
  const name = 'access_token';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// --- Interceptor de Requisição para Autenticação ---
api.interceptors.request.use(async (config) => {
  // 1. Obtém o token salvo pelo seu AuthProvider
  const token = getAccessToken();

  // 2. Se o token existir, injeta ele no cabeçalho Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});