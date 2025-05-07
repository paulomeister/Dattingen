"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Audit } from "@/types/Audit";
import { BarChart3Icon } from "lucide-react";

interface BusinessStatisticsProps {
  audits: Audit[];
}

export default function BusinessStatistics({ audits }: BusinessStatisticsProps) {

  const { t } = useLanguage()

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3Icon size={24} className="text-primary-color" />
        <h2 className="text-2xl font-bold text-primary-color">{t("business.statistics")}</h2>
      </div>

      {audits.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <BarChart3Icon size={48} className="mb-2 opacity-50" />
          <p>0</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4 bg-primary-color/5">
            <h3 className="text-sm font-medium mb-2">Total</h3>
            <p className="text-3xl font-bold">{audits.length}</p>
          </div>


        </div>
      )}
    </div>
  );
}