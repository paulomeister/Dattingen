"use client";
import React from "react";
import { SidebarHeader } from "../../ui/sidebar";
import { LucideClipboardList, Book } from "lucide-react";
import { Control } from "@/types/Ruleset";
import { useLanguage } from "@/lib/LanguageContext";

interface SidebarHeaderStatsProps {
  compulsoriness: string[];
  criterions: Control[];
}

const SidebarHeaderStats = ({ compulsoriness, criterions }: SidebarHeaderStatsProps) => {
  const { t } = useLanguage();
  return (
    <SidebarHeader className="space-y-4">
      <div className="flex items-center space-x-2 px-2 pt-2">
        <div className="h-8 w-8 rounded-lg bg-primary-color/10 flex items-center justify-center">
          <Book size={18} className="text-primary-color" />
        </div>
        <h2 className="text-lg font-semibold text-primary-color">{t('normatives.sidebar.ruleset')}</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-2 px-2">
        <div className="bg-secondary-color/5 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-sm text-secondary-color mb-1">
            <LucideClipboardList size={16} />
            <span>{t('normatives.sidebar.terms')}</span>
          </div>
          <p className="text-2xl font-medium text-primary-color">{compulsoriness.length}</p>
        </div>
        
        <div className="bg-tertiary-color/5 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-sm text-tertiary-color mb-1">
            <Book size={16} />
            <span>{t('normatives.sidebar.criteria')}</span>
          </div>
          <p className="text-2xl font-medium text-primary-color">{criterions.length}</p>
        </div>
      </div>
      
      <div className="h-px bg-tertiary-color/20 mx-1" />
    </SidebarHeader>
  );
};

export default SidebarHeaderStats;