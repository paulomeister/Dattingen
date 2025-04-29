"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import enTranslations from "@/locales/en.json";
import esTranslations from "@/locales/es.json";
import frTranslations from "@/locales/fr.json";
import { UserDTO } from "@/types/User";
import { environment } from "@/env/environment.dev";

export type Language = "en" | "es" | "fr";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, fallback?: string) => string;
  isLoading: boolean;
};

const translations = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isLoading, setIsLoading] = useState(false);

  //! Initialize language from user settings or browser
  useEffect(() => {
    const user: UserDTO | null = JSON.parse(localStorage.getItem("user") || "null");

    // First priority: User's saved preference from profile
    if (user?.language && ["en", "es", "fr"].includes(user.language as string)) {
      setLanguageState(user.language as Language);
      return;
    }

    // Second priority: Previously saved language in localStorage
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["en", "es", "fr"].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
      return;
    }

    //Third priority: Browser language
    const browserLanguage = navigator.language.split('-')[0];
    if (["en", "es", "fr"].includes(browserLanguage)) {
      setLanguageState(browserLanguage as Language);
      return;
    }
  }, []);

  // !Translation function
  //  that can handle nested paths and fallbacks
  const t = (key: string, fallback?: string): string => {
    try {
      const keys : string[] = key.split(".");
      let result = translations[language];

      // Navigate through the nested objects
      for (const k of keys) {
        if (result[k] === undefined) {
          console.warn(`Translation key not found: ${key}`);
          return fallback || key;
        }
        result = result[k];
      }

      return result;
    } catch (error) {
      console.error(`Error translating key: ${key}`, error);
      return fallback || key;
    }
  };

  //! Update language, save to localStorage and synchronize with user profile if available
  const setLanguage = async (newLanguage: Language) => {
    setIsLoading(true);

    // Update state and localStorage immediately for responsive UI
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);

    // Update user profile if logged in
    try {
      const user: UserDTO | null = JSON.parse(localStorage.getItem("user") || "null");

      if (user && user._id) {
        // Only update if the language is different from current user setting
        if (user.language !== newLanguage) {
          const updatedUser = { ...user, language: newLanguage };

          // Update user profile in the backend
          const response = await fetch(`${environment.API_URL}/users/api/${user._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              // Add authentication headers if needed
            },
            body: JSON.stringify({ language: newLanguage }),
          });

          if (response.ok) {
            // Update user in localStorage
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }
        }
      }
    } catch (error) {
      console.error("Failed to update user language preference:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
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