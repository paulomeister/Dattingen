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

// Componente para mostrar un criterio en un acordeón
const CriterionAccordion = ({ criterion, ruleset }: { criterion: Control, ruleset: Ruleset | null }) => {
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


      console.log("Data to save:", data);

      const index = ruleset.controls.findIndex((control) => control.controlId === data.controlId);

      if (index === -1) {
        // Si no existe el control, mostrar error
        alert("Error: No se encontró el control a actualizar");
        return;
      }

      // Crear una copia del ruleset para no mutar el original
      const updatedRuleset = { ...ruleset };

      // Actualizar el control
      updatedRuleset.controls[index] = data;

      // Enviar actualización al backend
      try {
        await updateRuleset(updatedRuleset._id as string, updatedRuleset);
        // window.location.reload(); // Recargar la página para reflejar los cambios
      } catch (exc) {
        console.error("Error at Control Update", exc);
      }
    }
  };

  const onDelete = async (controlId: string) => {
    if (!ruleset || !controlId) return;

    try {
      // Crear una copia del ruleset
      const updatedRuleset = { ...ruleset };

      // Filtrar el array de controles para eliminar el control con el controlId especificado
      updatedRuleset.controls = ruleset.controls.filter(control => control.controlId !== controlId);

      // Enviar la actualización al backend
      await updateRuleset(ruleset._id as string, updatedRuleset);

      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar el criterio:", error);
      alert("Error al eliminar el criterio, por favor intenta de nuevo.");
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
            <span className="text-xs text-primary-color mr-1">C{criterion.controlId}.</span>
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
