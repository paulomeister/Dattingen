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
    loading: boolean;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setAuthUser] = useState<UserDTO | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    function logout() {
        setAuthUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    useEffect(() => {
        console.log("Token:", token);
        console.log("User:", user);
        // Guardar token y usuario en localStorage al cambiar
        if (token) {
            localStorage.setItem("token", token);
        }
        if (user) {
            
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [token, user]);


    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken) setToken(storedToken);
        if (storedUser) {
            try {
                setAuthUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing user:", e);
            }
        }
        setLoading(false); // Terminó de cargar
    }, []);


    return (
        <AuthContext.Provider value={{ user, token, isLoggedIn: !!token, setAuthUser, setToken, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe estar dentro de AuthProvider");
    return ctx;
};