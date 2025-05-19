"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { useApiClient } from "@/hooks/useApiClient";
import { Audit, AuditProcess } from "@/types/Audit";
import { Control as RulesetControl } from "@/types/Ruleset";
import ControlsAccordion from "@/components/audits/ControlsAccordion";
import ControlScreen from "@/components/audits/ControlScreen";
import { ResponseDTO } from "@/types/ResponseDTO";
import { Assesment } from "@/types/Audit";

// Interfaz para la respuesta de la API
interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Define Control type for ControlsAccordion compatibility
interface AccordionControl {
  controlId: string;
  title: string;
  description: string;
  suitability: string | null;
  cycleStage: "PLAN" | "DO" | "CHECK" | "ACT";
  compulsoriness: string;
}

export default function AuditDetailPage() {
  // TODO Hacer Multilingual  
  const params = useParams();
  const rulesetId = params?.rulesetId as string;
  const auditProcessId = params?.auditProcessId as string;
  const { t } = useLanguage();
  const { user } = useAuth();
  const apiClient = useApiClient();

  const [selectedControl, setSelectedControl] = React.useState<RulesetControl | null>(null);
  const [audit, setAudit] = React.useState<Audit | null>(null);
  const [currentProcess, setCurrentProcess] = React.useState<AuditProcess | null>(null);
  const [currentAssesment, setCurrentAssesment] = React.useState<Assesment | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [controls, setControls] = React.useState<RulesetControl[]>([]); // Cambiar el tipo según la estructura de los controles
  // Función para obtener la auditoría
  const fetchAudit = async (businessIdParam?: string) => {
    const businessIdToUse = businessIdParam || currentProcess?.businessId;
    if (!rulesetId || !businessIdToUse) return;
    try {
      setLoading(true);
      setError(null);
      // Usar el businessId del AuditProcess si está disponible
      const response = await apiClient.get<ApiResponse<Audit>>(`/businesses/api/${businessIdToUse}/audit/${rulesetId}`);
      if (response.data) {
        // Convertir las fechas de string a Date
        const auditData: Audit = {
          ...response.data,
          startDate: new Date(response.data.startDate),
          endDate: new Date(response.data.endDate)
        };
        setAudit(auditData);
      } else {
        setError("No audit data found");
      }
    } catch (err) {
      console.error("Error fetching audit:", err);
      setError("Failed to fetch audit data");
    } finally {
      setLoading(false);
    }
  };

  const fetchControls = async (rulesetId: string) => {
    if (!rulesetId) return;

    try {
      setLoading(true);
      setError(null);

      // Llamar al endpoint que creamos en el backend
      const response = await apiClient.get<RulesetControl[]>(`/rulesets/api/controls/${rulesetId}`);

      setControls(response);
      setSelectedControl(response[0] || null); // Seleccionar el primer control por defecto

    } catch (err) {
      console.error("Error fetching ruleset:", err);
      setError("Failed to fetch ruleset data");
    }
  }
  // Cambiado: fetchAuditProcess ahora usa el endpoint getById y el id de la URL
  const fetchAuditProcess = async (auditProcessId: string) => {
    if (!auditProcessId) return;
    try {
      setLoading(true);
      setError(null);
      const response: ResponseDTO<AuditProcess> = await apiClient.get(`/audits/api/auditProcesses/getById?auditProcessId=${auditProcessId}`);
      if (response.data) {
        setCurrentProcess(response.data);
      } else {
        setError("No audit process found");
      }
    } catch (error) {
      console.error("Error fetching audit process:", error);
      setError("Failed to fetch audit process");
    } finally {
      setLoading(false);
    }
  };

  // Adapt controls to match ControlsAccordion expected type
  function adaptControls(controls: RulesetControl[]): AccordionControl[] {
    return controls.map((c) => ({
      ...c,
      suitability: c.suitability ?? null,
    }));
  }

  // Mejorar la inicialización de controles y assessments
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchControls(rulesetId);
    fetchAuditProcess(auditProcessId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rulesetId, auditProcessId, user]);

  // Cuando se obtenga el currentProcess, hacer fetchAudit con su businessId
  useEffect(() => {
    if (currentProcess?.businessId) {
      fetchAudit(currentProcess.businessId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProcess?.businessId]);

  // Cuando cambian los datos, inicializar el control y assessment seleccionados
  useEffect(() => {

    if (controls.length > 0 && currentProcess) {

      const firstControl = controls[0];

      console.log("First control:", firstControl);

      setSelectedControl(firstControl);
      // Buscar el assessment correspondiente al primer control
      const found = currentProcess.assesments?.find(a => a.controlId === firstControl.controlId) ?? null;
      setCurrentAssesment(found);
    }
  }, [controls, currentProcess]);

  function handleControlClick(control: RulesetControl) {
    setSelectedControl(control);
    // Buscar el assessment correspondiente al control seleccionado
    const found = currentProcess?.assesments?.find(a => a.controlId === control.controlId) ?? null;
    setCurrentAssesment(found);
  }



  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col md:flex-row gap-6 overflow-x-hidden">
      {loading ? (
        <div className="w-full flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <p className="text-lg font-semibold text-[var(--color-primary-color)]">
              {t?.('loading') || 'Loading audit data...'}
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="w-full flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-red-200">
            <p className="text-lg font-semibold text-red-500">{error}</p>
            <button
              onClick={() => fetchAudit()}
              className="mt-3 bg-[var(--color-primary-color)] text-white px-4 py-2 rounded-xl hover:bg-[var(--color-secondary-color)] transition"
            >
              {t?.('retry') || 'Retry'}
            </button>
          </div>
        </div>
      ) : audit ? (
        <>
          <aside className="w-full md:w-[700px] bg-white p-6 rounded-2xl shadow-md border space-y-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-bold text-[var(--color-primary-color)]">
                {'Audit'}
              </h2>
              <span className="text-xs text-gray-500">{audit.name}</span>
              <div className="mt-2 flex flex-col gap-1">
                <span className="text-xs font-semibold">
                  {'Status'}: <span className="text-[var(--color-secondary-color)]">{audit.status}</span>
                </span>
                <span className="text-xs">
                  {'Start'}: {audit.startDate.toLocaleDateString()}
                </span>
                <span className="text-xs">
                  {'End'}: {audit.endDate.toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="md:col-span-2">
              <ControlsAccordion controls={adaptControls(controls)} onControlClick={handleControlClick as (control: AccordionControl) => void} />
            </div>
          </aside>
          <div className="lg:col-span-2">
            {selectedControl && user?.businessId && currentAssesment ? (
              <ControlScreen
                control={selectedControl}
                currentProcess={currentProcess!}
                assesment={currentAssesment}
              />
            ) : (
              <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex items-center justify-center">
                <p className="text-gray-500">{selectedControl ? "No assessment found for this control" : "Select a control from the list to view details"}</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="w-full flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <p className="text-lg font-semibold text-gray-500">
              {t?.('noAuditFound') || 'No audit found'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

