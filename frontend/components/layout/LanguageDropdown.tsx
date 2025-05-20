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
import { useAuth } from "@/lib/AuthContext";
import { UserDTO } from "@/types/User";
import { useApiClient } from "@/hooks/useApiClient";
import { ResponseDTO } from "@/types/ResponseDTO";

const LanguageDropdown = () => {
  const { language, setLanguage } = useLanguage();
  const { user, setAuthUser } = useAuth();
  const apiClient = useApiClient();

  const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "es", label: "Español", flag: "🇪🇸" },

  ];

  const handleLanguageChange = async (lang: Language) => {
    setLanguage(lang);

    if (!user) return

    const response: ResponseDTO<UserDTO> = await apiClient.put(`/users/api/${user._id}`, {
      language: lang,
    })

    if (response.status >= 300) {
      console.error("Failed to update language preference");
    } else {
      const user: UserDTO = response.data;
      setAuthUser(user);
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
