// /lib/AuthContext.tsx
"use client"
import { createContext, useContext, useState } from "react";
import { User } from "@/types/User";

type AuthContextType = {
    user: User | null;
    token: string | null;
    setAuthUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setAuthUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    return (
        <AuthContext.Provider value={{ user, token, setAuthUser, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe estar dentro de AuthProvider");
    return ctx;
};
