// /lib/AuthContext.tsx
"use client"
import { createContext, useContext, useState, useEffect } from "react"; // Importa useEffect
import { UserDTO } from "@/types/User";

type AuthContextType = {
    user: UserDTO | null;
    token: string | null;
    isLoggedIn: boolean;
    setAuthUser: (user: UserDTO | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // Inicializa el estado a null o un valor por defecto que no dependa del navegador
    const [user, setAuthUser] = useState<UserDTO | null>(null);
    const [token, setToken] = useState<string | null>(null); // Asumiendo que el token tampoco está en localStorage inicialmente aquí

    function logout() {
        setAuthUser(null);
        setToken(null);
        localStorage.removeItem("user"); // Limpiar datos del usuario
    }

    useEffect(() => {

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setAuthUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing user from localStorage:", e);
                localStorage.removeItem("user"); // Limpiar datos corruptos
            }
        }

    }, []);
    return (
        <AuthContext.Provider value={{ user, token, isLoggedIn: !!user, setAuthUser, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe estar dentro de AuthProvider");
    return ctx;
};