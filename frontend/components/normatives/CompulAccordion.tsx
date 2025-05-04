"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import CompulsorinessForm from "./CompulsorinessForm";
import { AlertCircle } from "lucide-react";

const CompulAccordion = ({
  compulsoriness,
}: {
  compulsoriness: string;
}) => {
  const onSave = (data: Compulsoriness) => {
    // TODO: Implementar guardado real con API
    alert("guardar TERMINO");
  };

  const onDelete = (criterionId: string) => {
    // TODO: Implementar eliminación real con API
    alert("eliminar TÉRMINO!!!");
  };

  return (
    <Accordion type="single" collapsible className="border-0">
      <AccordionItem value="item-1" className="border-0 mb-1">
        <AccordionTrigger
          className="bg-secondary-color/5 hover:bg-secondary-color/10 py-2 px-3 rounded-lg transition-colors
                     text-sm font-medium text-gray-700 hover:no-underline flex items-center gap-2"
        >
          <AlertCircle size={16} className="text-secondary-color" />
          <span className="font-medium">{compulsoriness}</span>
        </AccordionTrigger>
        <AccordionContent className="pt-3 px-1">
          <CompulsorinessForm
            compulsoriness={compulsoriness}
            onSave={onSave}
            onDelete={onDelete}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CompulAccordion;
