// /lib/AuthContext.tsx
"use client"
import { createContext, useContext, useState, useEffect } from "react";
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
    const [user, setAuthUser] = useState<UserDTO | null>(null);
    const [token, setToken] = useState<string | null>(null);

    function logout() {
        setAuthUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    useEffect(() => {
        // Recuperar token y usuario del localStorage al iniciar
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setAuthUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing user from localStorage:", e);
                localStorage.removeItem("user");
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, isLoggedIn: !!token, setAuthUser, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe estar dentro de AuthProvider");
    return ctx;
};