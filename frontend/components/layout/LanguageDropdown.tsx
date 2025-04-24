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

const LanguageDropdown = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
  ];

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button   size="icon" className="cursor-pointer">
          <Globe2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as Language)}
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
