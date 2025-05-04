"use client";
import React from "react";
import {
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "../../ui/sidebar";
import { Compulsoriness } from "@/types/Criterion";
import CompulAccordion from "../CompulAccordion";

// Componente para mostrar la sección de términos de obligatoriedad
const CompulsorinessSection = ({ items }: { items: Compulsoriness[] }) => {
  return (
    <>
      <SidebarGroupLabel className="text-primary-color font-medium mb-2">
        Terms of Obligation
      </SidebarGroupLabel>
      <div className="h-px bg-tertiary-color/20 mb-3 mx-1" />
      <SidebarGroupContent>
        <SidebarMenu>
          {items.length > 0 ? (
            items.map((compulsoriness, index) => (
              <CompulAccordion
                key={index}
                compulsoriness={compulsoriness}
              />
            ))
          ) : (
            <div className="text-sm text-gray-400 italic p-2">
              No terms defined yet
            </div>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </>
  );
};

export default CompulsorinessSection;