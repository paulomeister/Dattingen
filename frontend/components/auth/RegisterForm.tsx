"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserInput } from "./UserInput";
import { RoleSelector } from "./RoleSelector";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "@/lib/LanguageContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { environment } from "@/env/environment.dev";
import { useAuth } from "@/lib/AuthContext";
import { RoleEnum } from "@/types/RoleEnum";

export function RegisterForm() {
  // Language
  const { t } = useLanguage();
  const router = useRouter();
  const { setToken } = useAuth();
  // Component State
  const [userRegister, setUserRegister] = useState({
    username: "",
    name: "",
    email: "",
    language: "en",
    password: "",
    role: "InternalAuditor" as RoleEnum,
    securityQuestion: {
      securityQuestion: "What is your favorite color?",
      securityAnswer: "blue"
    }
  });

  const handleChange = (field: keyof typeof userRegister, value: string) => {
    setUserRegister((prev) => ({ ...prev, [field]: value }));
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Crear el FormData con el campo 'incomingString'
      const formData = new FormData();
      formData.append('incomingString', JSON.stringify(userRegister));
      const response = await fetch(`${environment.API_URL}/security/api/signup`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        toast.success(t("auth.register.successMessage"));

        // Guardar el token en el localStorage
        const token = response.headers.get("Authorization")?.split(" ")[1] || null;
        if (token) {
          setToken(token);
        }

        if (userRegister.role === "Coordinator") {
          localStorage.setItem("firstTime", JSON.stringify("true"));
        }
        router.push("/auth");
      } else {
        const errorText = await response.text();
        console.log(errorText);
        toast.error(t("auth.register.errorMessage"));
      }
    } catch (err) {
      console.log(err);
      toast.error(t("auth.register.errorMessage"));
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
            value={userRegister.username}
            onChange={(v) => handleChange("username", v)}
            placeholder={t("auth.register.usernamePlaceholder")}
          />
          <UserInput
            id="name"
            label={t("auth.register.fullName")}
            value={userRegister.name}
            onChange={(v) => handleChange("name", v)}
            placeholder={t("auth.register.fullNamePlaceholder")}
          />
          <UserInput
            id="email"
            label={t("auth.register.email")}
            type="email"
            value={userRegister.email}
            onChange={(v) => handleChange("email", v)}
            placeholder={t("auth.register.emailPlaceholder")}
          />
          <RoleSelector
            value={userRegister.role as RoleEnum}
            onChange={(v) => handleChange("role", v as RoleEnum)}
          />
          <LanguageSelector
            value={userRegister.language}
            onChange={(v) => handleChange("language", v)}
          />
          <UserInput
            id="password"
            label={t("auth.register.password")}
            type="password"
            value={userRegister.password}
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
