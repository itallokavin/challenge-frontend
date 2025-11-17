import LoginForm from "../../../app/login/LoginForm"
import { IconComponent } from "../../ui/Icons"

export default function LoginPage() {  
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
                <div className="flex flex-col items-center space-y-3 mb-8">
                    <div className="p-4 bg-indigo-600 rounded-full shadow-xl">
                        <IconComponent.UserIcon className="w-8 h-8 text-white"/>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                        HealthFlow
                    </h1>
                </div>
                <LoginForm />
                <div>
                    
                </div>
            </div>
        </div>
    )
    
}
