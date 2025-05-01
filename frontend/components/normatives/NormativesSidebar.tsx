"use client";
import React, { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
} from "../ui/sidebar";
import { Compulsoriness, Criterion, CycleStageEnum } from "@/types/Criterion";
import { Button } from "../ui/button";
import { Plus, Download } from "lucide-react";

// Importar los componentes modulares que creamos
import SidebarHeaderStats from "./sidebar/SidebarHeader";
import CompulsorinessSection from "./sidebar/CompulsorinenessSection";
import CriterionsSection from "./sidebar/CriterionsSection";

const NormativesSidebar = () => {
  // TODO Quitar estos datos estáticos por llamada de una API
  const [items, setItems] = useState<{
    Compulsoriness: Compulsoriness[];
    Criterions: Criterion[];
  }>({
    Compulsoriness: [
      {
        id: "1",
        term: "Must",
      },
      {
        id: "2",
        term: "Should",
      },
    ],
    Criterions: [
      {
        controlId: "1",
        title: "Is it accessible?",
        description: "This is the description",
        cycleStage: CycleStageEnum.P,
        compulsoriness: [
          {
            id: "1",
            term: "Must",
          },
        ],
      },
      {
        controlId: "2",
        title: "Is it true",
        description: "This is the description",
        cycleStage: CycleStageEnum.D,
        compulsoriness: [
          {
            id: "1",
            term: "Must",
          },
        ],
      },
    ],
  });

  // Simulamos carga de datos inicial con un pequeño delay para mejor UX
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula una carga de datos desde API
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Función para añadir un nuevo término (placeholder)
  const handleAddTerm = () => {
    // TODO: Implementar lógica real con API
    alert("Esta función permitiría agregar nuevos términos desde la UI");
  };

  // Función para descargar ruleset (placeholder)
  const handleDownload = () => {
    // TODO: Implementar lógica real con API
    alert("Esta función permitiría exportar el ruleset completo");
  };

  return (
    <Sidebar collapsible="offcanvas" variant="floating">
      {/* Encabezado con estadísticas */}
      <SidebarHeaderStats
        compulsoriness={items.Compulsoriness}
        criterions={items.Criterions}
      />

      {/* Contenido principal con scroll */}
      <SidebarContent className="px-1">
        {loading ? (
          // Estado de carga
          <div className="flex flex-col space-y-4 p-4">
            <div className="h-6 bg-tertiary-color/10 rounded animate-pulse w-2/3"></div>
            <div className="h-10 bg-tertiary-color/10 rounded animate-pulse"></div>
            <div className="h-10 bg-tertiary-color/10 rounded animate-pulse"></div>
          </div>
        ) : (
          <>
            {/* Sección de términos de obligatoriedad */}
            <SidebarGroup className="mb-6">
              <CompulsorinessSection items={items.Compulsoriness} />
            </SidebarGroup>

            {/* Sección de criterios */}
            <SidebarGroup>
              <CriterionsSection items={items.Criterions} />
            </SidebarGroup>
          </>
        )}
      </SidebarContent>


    </Sidebar>
  );
};

export default NormativesSidebar;
