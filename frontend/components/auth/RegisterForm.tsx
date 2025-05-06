"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserInput } from "./UserInput";
import { RoleSelector } from "./RoleSelector";
import { LanguageSelector } from "./LanguageSelector";
import { User } from "@/types/User";
import { useLanguage } from "@/lib/LanguageContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { environment } from "@/env/environment.dev";

export function RegisterForm() {
  // Language
  const { t } = useLanguage();
  const router = useRouter();
  // Component State
  const [user, setUser] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "InternalAuditor",
    language: "en",
    securityQuestion: {
      securityQuestion: "What is your favorite color?",
      securityAnswer: "blue"
    }
  });

  const handleChange = (field: keyof typeof user, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Crear el FormData con el campo 'incomingString'
      const formData = new FormData();

      console.log(user)

      formData.append('incomingString', JSON.stringify(user));
      const response = await fetch(`${environment.API_URL}/security/api/signup/`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        toast.success(t("auth.register.successMessage"));
        if (user.role === "Coordinator") {
          router.push("/business/create");
        } else {
          router.push("/");
        }
      } else {
        const errorText = await response.text();
        toast.error(t("auth.register.errorMessage") + (errorText ? `: ${errorText}` : ""));
      }
    } catch {
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
