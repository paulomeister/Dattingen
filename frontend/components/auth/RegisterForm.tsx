"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserInput } from "./UserInput";
import { RoleSelector } from "./RoleSelector";
import { LanguageSelector } from "./LanguageSelector";
import { User } from "@/types/User";
import { useLanguage } from "@/lib/LanguageContext";
import { environment } from "@/env/environment.dev";
import { useAuth } from "@/lib/AuthContext";


export function RegisterForm() {

  // Language
  
  const { t } = useLanguage()

  // Component State

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User>({
    _id: null,
    username: "",
    name: "",
    email: "",
    password: "",
    role: "InternalAuditor",
    language: "en",
    bussinessId: null,
  });
  const handleChange = (field: keyof User, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  // Authentication

  const { setAuthUser, token } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8090/users/api/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }), // opcional
        },
        body: JSON.stringify(user),
      });

      if (!res.ok) throw new Error("Error registering the user");

      const newUser = await res.json();
      setAuthUser(newUser); // actualizamos el usuario en contexto
      // Podés redirigir o mostrar mensaje de éxito
    } catch (err) {
      console.error("Error:", err);
      // mostrar feedback visual
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-primary-color border-2 shadow-2xl rounded-lg">
      <form onSubmit={handleSubmit} >
        <CardContent className="pt-6 space-y-4">
          <UserInput
            id="username"
            label={t("auth.register.username")}
            value={user.username}
            onChange={(v) => handleChange("username", v)}
            placeholder={t("auth.register.usernamePlaceholder")}
          />
          <UserInput
            id="name"
            label={t("auth.register.fullName")}
            value={user.name}
            onChange={(v) => handleChange("name", v)}
            placeholder={t("auth.register.fullNamePlaceholder")}
          />
          <UserInput
            id="email"
            label={t("auth.register.email")}
            type="email"
            value={user.email}
            onChange={(v) => handleChange("email", v)}
            placeholder={t("auth.register.emailPlaceholder")}
          />
          <RoleSelector
            value={user.role}
            onChange={(v) => handleChange("role", v)}
          />
          <LanguageSelector
            value={user.language}
            onChange={(v) => handleChange("language", v)}
          />
          <UserInput
            id="password"
            label={t("auth.register.password")}
            type="password"
            value={user.password}
            onChange={(v) => handleChange("password", v)}
            placeholder={t("auth.register.passwordPlaceholder")}
          />
        </CardContent>
        <CardFooter className="mt-5">
          <Button
            type="submit"
            className="w-full bg-secondary-color text-white cursor-pointer hover:bg-tertiary-color"
            disabled={isLoading}
          >
            {isLoading ? "" : t("auth.register.registerButton")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
