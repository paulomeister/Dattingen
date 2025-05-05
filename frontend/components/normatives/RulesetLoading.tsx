"use client";

import { useLanguage } from "@/lib/LanguageContext";

export function LoadingState() {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="p-4 text-center mb-8">
        <p className="text-gray-500 animate-pulse text-lg">
          {t("rulesets.details.loading")}
        </p>
      </div>
      <div className="bg-gradient-to-r from-primary-color/60 to-secondary-color/60 rounded-xl shadow-xl overflow-hidden mb-8 animate-pulse">
        <div className="p-8">
          <div className="h-10 bg-white/30 rounded w-2/3 mb-6"></div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-6 bg-white/30 rounded w-full"></div>
            <div className="h-6 bg-white/30 rounded w-full"></div>
            <div className="h-6 bg-white/30 rounded w-full"></div>
            <div className="h-6 bg-white/30 rounded w-full"></div>
          </div>
        </div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-40 animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}