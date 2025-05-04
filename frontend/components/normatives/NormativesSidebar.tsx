"use client";
import React, { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
} from "../ui/sidebar";
import SidebarHeaderStats from "./sidebar/SidebarHeader";
import CriterionsSection from "./sidebar/CriterionsSection";
import { environment } from "@/env/environment.dev";
import { useAuth } from "@/lib/AuthContext";
import { Control, Ruleset } from "@/types/Ruleset";
import { useParams } from "next/navigation";

interface NormativesSidebarProps {
  rulesetId?: string; // Opcional: si se pasa directamente como prop
}

const NormativesSidebar = ({ rulesetId: propRulesetId }: NormativesSidebarProps) => {
  const params = useParams();
  const { user } = useAuth();

  // Obtener el rulesetId de los parámetros de URL o de los props
  const rulesetId = propRulesetId || (params?.rulesetId as string);

  // Estados para compulsoriness y criterions
  const [compulsoriness, setCompulsoriness] = useState<string[]>([]);
  const [criterions, setCriterions] = useState<Control[]>([]);
  const [ruleset, setRuleset] = useState<Ruleset | null>(null);

  // Estado de carga
  const [loading, setLoading] = useState(true);

  // Lógica para obtener los términos de compulsoriedad
  const fetchCompulsoriness = async () => {
    try {
      const isSpanish = user?.language === "es";
      const res = await fetch(`${environment.API_URL}/rulesets/api/ListCompulsoriness${isSpanish ? "/es" : ""}`);
      const data = await res.json();
      setCompulsoriness(data);  // Actualizar el estado con los datos obtenidos
    } catch (error) {
      console.error("Error al obtener los términos de compulsoriedad:", error);
    } finally {
      setLoading(false);  // Finaliza el estado de carga
    }
  };

  const fetchRuleset = async () => {
    if (!rulesetId) {
      console.error("No se encontró un ID de ruleset válido");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${environment.API_URL}/rulesets/api/findbyid/${rulesetId}`);
      const data = await res.json();
      setRuleset(data);  // Actualizar el estado con los datos obtenidos
      setCriterions(data.controls || []);  // Actualizar los criterios, con fallback a array vacío
    } catch (e) {
      console.error("Error at Normatives Sidebar", e);
    } finally {
      setLoading(false);
    }
  }

  // Llamada a la API cuando el componente se monta o cuando cambia el rulesetId
  useEffect(() => {
    fetchCompulsoriness();
    if (rulesetId) {
      fetchRuleset();
    }
  }, [rulesetId, user?.language]);

  return (
    <Sidebar collapsible="offcanvas" variant="floating">
      {/* Encabezado con estadísticas */}
      <SidebarHeaderStats
        compulsoriness={compulsoriness}
        criterions={criterions}
      />

      {/* Contenido principal con scroll */}
      <SidebarContent className="px-1">
        {loading ? (
          <div className="flex flex-col space-y-4 p-4">
            <div className="h-6 bg-tertiary-color/10 rounded animate-pulse w-2/3"></div>
            <div className="h-10 bg-tertiary-color/10 rounded animate-pulse"></div>
            <div className="h-10 bg-tertiary-color/10 rounded animate-pulse"></div>
          </div>
        ) : (
          <>

            <SidebarGroup>
              <CriterionsSection items={criterions} />
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default NormativesSidebar;
