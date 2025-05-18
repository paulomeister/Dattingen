"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { useApiClient } from "@/hooks/useApiClient";
import { Assesment, Audit, AuditProcess } from "@/types/Audit";
import { Control } from "@/types/Ruleset";
import ControlsAccordion from "@/components/audits/ControlsAccordion";
import ControlScreen from "@/components/audits/ControlScreen";
import { ResponseDTO } from "@/types/ResponseDTO";

// Interfaz para la respuesta de la API
interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export default function AuditDetailPage() {
  // TODO Hacer Multilingual  
  const params = useParams();
  const rulesetId = params?.rulesetId as string;
  const { t } = useLanguage();
  const { user } = useAuth();
  const apiClient = useApiClient();

  const [selectedControl, setSelectedControl] = React.useState<Control | null>(null);
  const [selectedAssesment, setSelectedAssesment] = React.useState<Assesment | undefined>(undefined);
  const [audit, setAudit] = React.useState<Audit | null>(null);
  const [currentProcess, setCurrentProcess] = React.useState<AuditProcess | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [controls, setControls] = React.useState<Control[]>([]); // Cambiar el tipo según la estructura de los controles
  // Función para obtener la auditoría
  const fetchAudit = async () => {
    if (!rulesetId) return;

    try {
      setLoading(true);
      setError(null);

      // Necesitamos el ID del negocio, podemos obtenerlo del usuario
      const businessId = user?.businessId;

      if (!businessId) {
        setError("Business ID not found");
        setLoading(false);
        return;
      }

      // Llamar al endpoint que creamos en el backend
      const response = await apiClient.get<ApiResponse<Audit>>(`/businesses/api/${businessId}/audit/${rulesetId}`);

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
      const response = await apiClient.get<Control[]>(`/rulesets/api/controls/${rulesetId}`);

      setControls(response);
      setSelectedControl(response[0] || null); // Seleccionar el primer control por defecto

    } catch (err) {
      console.error("Error fetching ruleset:", err);
      setError("Failed to fetch ruleset data");
    }
  }
  const fetchAuditProcess = async (rulesetId: string, businessId: string) => {
    try {
      const response = await apiClient.get<ResponseDTO<AuditProcess>>(`/audits/api/get?businessId=${businessId}&auditId=${rulesetId}&rulesetId=${rulesetId}`);
      if (response.data) {
        setCurrentProcess(response.data);
      }
    } catch (error) {
      console.error("Error fetching audit process:", error);
    }
  }

  // Cargar la auditoría cuando cambie el rulesetId o el usuario
  useEffect(() => {
    fetchAudit();
    fetchControls(rulesetId);
    if (user?.businessId) {
      fetchAuditProcess(rulesetId, user.businessId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rulesetId, user]);


  function handleControlClick(control: Control) {
    const assesment: Assesment | undefined = currentProcess?.assesment.find(a => a.controlId === control.controlId);
    if (assesment) {
      setSelectedControl(control);
      setSelectedAssesment(assesment);
    } else {
      alert("ERROR : ANY ASSESMENT FOUND / NO SE ENCONTRÓ NINGUNA EVALUACIÓN");
    }
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
              onClick={fetchAudit}
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
              <ControlsAccordion controls={controls} onControlClick={handleControlClick} />
            </div>
          </aside>
          <div className="lg:col-span-2">
            {selectedControl && user?.businessId ? (
              <ControlScreen rulesetId="ISO27001" control={selectedControl} businessId={user?.businessId} />
            ) : (
              <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex items-center justify-center">
                <p className="text-gray-500">Select a control from the list to view details</p>
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

