"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import { loginService } from "../services/auth.service";
import { LoginDTO } from "../types/auth.types";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ATTENDANT' | 'DOCTOR' | string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (loginDto: LoginDTO) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  async function login(data: LoginDTO) {
    try {
      const result = await loginService(data);

      setUser(result.user);
      localStorage.setItem("user", JSON.stringify(result.user));

      document.cookie = `access_token=${result.token}; path=/; max-age=3600;`;

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao fazer login",
      };
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
    document.cookie = "access_token=; path=/; max-age=0";
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}
