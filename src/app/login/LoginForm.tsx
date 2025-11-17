'use client'

import { useForm } from "react-hook-form"
import { PrimaryButton}  from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { LoginDTO } from "@/src/modules/auth/types/auth.types"
import { useAuth } from "@/src/modules/auth/hooks/useAuth"
import { useState } from "react"
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/navigation"

export default function LoginForm() {
    const { register, handleSubmit } = useForm<LoginDTO>()
    const { login, loading } = useAuth();

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const router = useRouter();

    const handleFormSubmit = async (loginDto: LoginDTO) => {
        const response = await login(loginDto);
        
        if (!response.success) {
            setSnackbarMessage(response.error ?? "");
            setOpenSnackbar(true);
            return;
        }

        router.push("/dashboard");
    }
    
    return(
        <>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                <Input id="email" type="email" placeholder="ex: doctor@hospital.com" register={register} />
                <Input id="password" type="password" placeholder="****" register={register} />
                <PrimaryButton type="submit" label={loading ? "Entrando..." : "Entrar"} />          
            </form>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3500}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
            <Alert
                severity="error"
                variant="filled"
                onClose={() => setOpenSnackbar(false)}
                sx={{ width: "100%" }}
                >
            {snackbarMessage}
            </Alert>
            </Snackbar>
        </>
    )
} 