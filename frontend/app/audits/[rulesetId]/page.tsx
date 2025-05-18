"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { useApiClient } from "@/hooks/useApiClient";
import { Audit } from "@/types/Audit";

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

  const [audit, setAudit] = React.useState<Audit | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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
  // Cargar la auditoría cuando cambie el rulesetId o el usuario
  React.useEffect(() => {
    fetchAudit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rulesetId, user]); return (
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
          <aside className="w-full md:w-64 bg-white p-6 rounded-2xl shadow-md border space-y-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold text-[var(--color-primary-color)]">
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

            <div>
              <h3 className="font-semibold mb-2">Plan</h3>
              <ul className="list-disc list-inside text-sm text-gray-700">
                <li>Criterion 1.1</li>
                <li>Criterion 1.2</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do</h3>
              <ul className="list-disc list-inside text-sm text-gray-700">
                <li className="font-bold text-[var(--color-primary-color)]">Criterion 3.3</li>
                <li>Criterion 3.4</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Check</h3>
              <ul className="list-disc list-inside text-sm text-gray-700">
                <li>Criterion 4.1</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Act</h3>
              <ul className="list-disc list-inside text-sm text-gray-700">
                <li>Criterion 5.1</li>
                <li>Criterion 5.2</li>
              </ul>
            </div>
          </aside>

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





//  Contenido principal
//       <main className="flex-1 bg-white rounded-2xl shadow-md p-6 space-y-6 overflow-x-auto">
//         <header className="flex justify-between items-center flex-wrap gap-2">
//           <h1 className="text-2xl font-bold">Audit #{id} - Criterion 3.3</h1>
//           <div className="bg-red-100 text-red-800 text-sm px-4 py-2 rounded-full shadow">
//             Due Date: June 18, 2025
//           </div>
//         </header>

//         <section className="space-y-4">
//           {/* Obligación */}
//           <div className="flex items-center gap-2">
//             <span className="font-semibold">Requirement Term:</span>
//             <span className="bg-[var(--color-secondary-color)] text-white px-3 py-1 rounded-full text-sm">Shall</span>
//           </div>

//           {/* Texto del criterio */}
//           <div className="bg-gray-100 p-4 rounded-2xl text-sm text-gray-700 shadow-inner">
//             Persons doing work under the organization’s control shall be aware of:<br />
//             a) the information security policy;<br />
//             b) their contribution to the effectiveness of the information security management system;<br />
//             c) the implications of not conforming with the information security management system.
//           </div>

//           {/* Documentación */}
//           <div>
//             <h3 className="font-semibold text-[var(--color-primary-color)] mb-2">Documentation</h3>
//             <div className="flex flex-wrap gap-4">
//               <input
//                 type="text"
//                 placeholder="Document URL or Name"
//                 className="flex-1 border px-4 py-2 rounded-2xl shadow-sm"
//               />
//               <button className="bg-[var(--color-primary-color)] text-white px-4 py-2 rounded-2xl hover:bg-[var(--color-secondary-color)] transition">
//                 Upload New
//               </button>
//             </div>
//           </div>

//           {/* Estado */}
//           <div>
//             <h3 className="font-semibold text-[var(--color-primary-color)] mb-2">Status</h3>
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 border rounded-full flex items-center justify-center font-bold text-lg text-gray-600">
//                 ?
//               </div>
//               <span className="text-gray-600">To Be Evaluated</span>
//             </div>
//           </div>

//           {/* Comentarios */}
//           <div>
//             <h3 className="font-semibold text-[var(--color-primary-color)] mb-2">Comments</h3>
//             <textarea
//               rows={4}
//               placeholder="Write your comments here..."
//               className="w-full border px-4 py-2 rounded-2xl shadow-sm resize-none"
//             ></textarea>
//             <button className="mt-3 bg-[var(--color-primary-color)] text-white px-6 py-2 rounded-2xl hover:bg-[var(--color-secondary-color)] transition">
//               Submit
//             </button>
//           </div>
//         </section>
//       </main>