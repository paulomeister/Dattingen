"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Criterion, CycleStageEnum, SuitabilityEnum } from "@/types/Criterion";
import CriterionForm from "./CriterionForm";
import { BookOpen, ClipboardCheck, SearchCheck } from "lucide-react";

// Interfaz para los datos del formulario que coincida con CriterionForm
interface DataForm {
  title: string;
  description: string;
  cycleStage: CycleStageEnum;
  suitabilities: SuitabilityEnum[]; // Tipo específico en lugar de any[]
}

// Función para determinar el icono según la etapa del ciclo
const getCycleStageIcon = (cycleStage: CycleStageEnum) => {
  switch (cycleStage) {
    case CycleStageEnum.P:
      return <ClipboardCheck size={16} className="text-primary-color" />;
    case CycleStageEnum.D:
      return <SearchCheck size={16} className="text-primary-color" />;
    default:
      return <BookOpen size={16} className="text-primary-color" />;
  }
};

const CriterionAccordion = ({ criterion }: { criterion: Criterion }) => {
  // Actualizada para manejar la interfaz DataForm y usar los parámetros
  const onSave = (_data: DataForm) => {
    // TODO: Implementar guardado real con API
    // En un caso real, usaríamos _data para enviar al backend
    console.log("Guardando criterio");
    alert("guardar CRITERIO");
  };

  const onDelete = (_criterionId: string) => {
    // TODO: Implementar eliminación real con API
    // En un caso real, usaríamos _criterionId para identificar el elemento a eliminar
    console.log("Eliminando criterio");
    alert("eliminar CRITERIO!!!");
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
