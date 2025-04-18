"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Compulsoriness } from "@/types/Criterion";
import CompulsorinessForm from "./CompulsorinessForm";

const CompulAccordion = ({
  compulsoriness,
}: {
  compulsoriness: Compulsoriness;
}) => {
  const onSave = (data: Compulsoriness) => {
    alert("guardar TERMINO");
  };

  const onDelete = (criterionId: string) => {
    alert("eliminar TÉRMINO!!!");
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger
          className="hover:cursor-pointer text-transparent inline-flex p-0 m-0
        bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500 text-md"
        >
          T.{" "}
          <span className="italic text-blue-500 inline p-0 m-0">
            {compulsoriness.term}
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <CompulsorinessForm
            compulsoriness={compulsoriness}
            onSave={onSave}
            onDelete={onDelete}
          ></CompulsorinessForm>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CompulAccordion;
