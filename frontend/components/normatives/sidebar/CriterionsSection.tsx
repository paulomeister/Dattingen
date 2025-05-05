"use client";
import React from "react";
import {
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "../../ui/sidebar";
import { Control, Ruleset } from "@/types/Ruleset";
import CriterionAccordion from "../CriterionAccordion";
import { FileText } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

// Componente para mostrar la sección de criterios (controles)
const CriterionsSection = ({ items, ruleset }: { items: Control[], ruleset: Ruleset | null }) => {
  const { t } = useLanguage();
  return (
    <>
      <SidebarGroupLabel className="text-primary-color font-medium mb-2">
        {t('normatives.sidebar.criterions')}
      </SidebarGroupLabel>
      <div className="h-px bg-tertiary-color/20 mb-3 mx-1" />
      <SidebarGroupContent>
        <SidebarMenu>
          {items && items.length > 0 ? (
            items.map((criterion) => (
              <CriterionAccordion
                key={criterion.controlId}
                criterion={criterion}
                ruleset={ruleset}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
              <FileText size={24} className="text-tertiary-color/50" />
              <div className="text-sm text-gray-400 italic">
                {t('normatives.sidebar.noCriterions')}
              </div>
            </div>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </>
  );
};

export default CriterionsSection;