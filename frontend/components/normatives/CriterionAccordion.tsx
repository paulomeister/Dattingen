"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CriterionForm from "./CriterionForm";
import { Control, PHVAPhase, Ruleset } from "@/types/Ruleset";
import { ClipboardCheck, ClipboardEdit, Beaker, ClipboardList } from "lucide-react";
import { updateRuleset } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";
import { toast } from "react-hot-toast";

// Componente para mostrar un criterio en un acordeón
const CriterionAccordion = ({ criterion, ruleset }: { criterion: Control, ruleset: Ruleset | null }) => {
  const { t } = useLanguage();
  const getCycleStageIcon = (stage: PHVAPhase) => {
    switch (stage) {
      case PHVAPhase.PLAN:
        return <ClipboardEdit size={16} className="text-blue-500 shrink-0" />;
      case PHVAPhase.DO:
        return <ClipboardList size={16} className="text-green-500 shrink-0" />;
      case PHVAPhase.CHECK:
        return <Beaker size={16} className="text-yellow-500 shrink-0" />;
      case PHVAPhase.ACT:
        return <ClipboardCheck size={16} className="text-red-500 shrink-0" />;
      default:
        return <ClipboardEdit size={16} className="text-primary-color shrink-0" />;
    }
  };

  // Actualizada para manejar la interfaz Control
  const onSave = async (data: Control) => {
    if (ruleset) {
      const index = ruleset.controls.findIndex((control) => control.controlId === data.controlId);
      if (index === -1) {
        toast.error(t('normatives.criterionAccordion.errorNotFound'));
        return;
      }
      const updatedRuleset = { ...ruleset };
      updatedRuleset.controls[index] = data;
      try {
        await updateRuleset(updatedRuleset._id as string, updatedRuleset);
        toast.success(t('normatives.criterionAccordion.saveSuccess'));
      } catch (exc) {
        console.error("Error at Control Update", exc);
        toast.error(t('normatives.criterionAccordion.saveError'));
      }
    }
  };

  const onDelete = async (controlId: string) => {
    if (!ruleset || !controlId) return;
    try {
      const updatedRuleset = { ...ruleset };
      updatedRuleset.controls = ruleset.controls.filter(control => control.controlId !== controlId);
      await updateRuleset(ruleset._id as string, updatedRuleset);
      toast.success(t('normatives.criterionAccordion.deleteSuccess'));
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar el criterio:", error);
      toast.error(t('normatives.criterionAccordion.errorDelete'));
    }
  };

  return (
    <Accordion type="single" collapsible className="border-0">
      <AccordionItem value="item-1" className="border-0 mb-1">
        <AccordionTrigger
          className="bg-primary-color/5 hover:bg-primary-color/10 py-2 px-3 rounded-lg transition-colors
                     text-sm font-medium text-gray-700 hover:no-underline flex items-center"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {getCycleStageIcon(criterion.cycleStage)}
            <span className="text-xs text-primary-color mr-1">{t('normatives.criterionAccordion.criterionPrefix')}{criterion.controlId}.</span>
            <span className="truncate">{criterion.title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-3 px-1">
          <CriterionForm
            ruleset={ruleset}
            criterion={criterion}
            onSave={onSave}
            onDelete={() => criterion.controlId && onDelete(criterion.controlId)}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CriterionAccordion;
