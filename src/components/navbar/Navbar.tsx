"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/src/modules/auth/hooks/useAuth";
import { IconComponent } from "../ui/Icons";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }
  return (
    <header className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center border border-indigo-100">
        <h1 className="text-xl font-bold text-indigo-700">{user?.name}</h1>
        <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600 hidden sm:block">
                Logado como: <span className="font-extrabold text-indigo-600">{user?.role}</span>
            </span>
            <button
                onClick={handleLogout}
                className="cursor-pointer  flex items-center px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-150 transform hover:scale-[1.05] focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
            >
                <IconComponent.LogoutIcon/>
                Sair
            </button>
        </div>
    </header>
  );
}