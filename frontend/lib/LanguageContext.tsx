"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import enTranslations from "@/locales/en.json";
import esTranslations from "@/locales/es.json";
import frTranslations from "@/locales/fr.json";

export type Language = "en" | "es" | "fr";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const translations = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  // Initialize from localStorage when component mounts
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["en", "es", "fr"].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Translation function that can handle nested paths
  const t = (key: string): string => {
    try {
      const keys = key.split(".");
      let result = translations[language];
      
      // Navigate through the nested objects
      for (const k of keys) {
        if (result[k] === undefined) {
          console.warn(`Translation key not found: ${key}`);
          return key;
        }
        result = result[k];
      }
      
      return result;
    } catch (error) {
      console.error(`Error translating key: ${key}`, error);
      return key;
    }
  };

  // Update language and save to localStorage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}