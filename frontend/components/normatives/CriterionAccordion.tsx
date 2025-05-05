"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Criterion } from "@/types/Criterion";
import CriterionForm from "./CriterionForm";
import { toast } from "react-hot-toast";

const CriterionAccordion = ({ criterion }: { criterion: Criterion }) => {
  const onSave = () => {
    toast.success("Criterio guardado correctamente");
  };

  const onDelete = () => {
    toast.success("Criterio eliminado correctamente");
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger
          className="
       text-md text-center text-neutral-900
        hover:cursor-pointer text-ellipsis"
        >
          <i
            className="text-transparent inline-flex p-0 m-0
        bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500"
          >
            C.{criterion.controlId}
          </i>
          {criterion.title}
        </AccordionTrigger>
        <AccordionContent>
          <CriterionForm
            criterion={criterion}
            onSave={onSave}
            onDelete={onDelete}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CriterionAccordion;
