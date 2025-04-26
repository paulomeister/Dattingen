"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { Button } from "@/components/ui/button";
import { Globe2 } from "lucide-react";
import { useLanguage, Language } from "@/lib/LanguageContext";
import { environment } from "@/env/environment.dev";
import { useAuth } from "@/lib/AuthContext";
import { UserDTO } from "@/types/User";

const LanguageDropdown = () => {
  const { language, setLanguage } = useLanguage();
  const { user, setAuthUser, token } = useAuth()

  const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
  ];

  const handleLanguageChange = async (lang: Language) => {
    setLanguage(lang);

    if (!user) return

    const response = await fetch(`${environment.API_URL}/users/api/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        "language": lang,
      })
    })

    if (!response.ok) {
      console.error("Failed to update language preference");
    } else {
      const user: UserDTO = await response.json()
      setAuthUser(user)
      console.log("Language preference updated successfully");
    }
  }


  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="cursor-pointer">
          <Globe2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as Language)}
            className={language === lang.code ? "bg-white  cursor-pointer text-primary-color" : "cursor-pointer"}
          >
            <span className="mr-2 bg-white text-primary-color hover:text-secondary-color">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
