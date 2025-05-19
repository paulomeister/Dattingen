"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useApiClient } from "@/hooks/useApiClient";
import { AuditProcess } from "@/types/Audit";
import { Card } from "@/components/ui/card";

export default function AuditProcessListPage() {
    const { user } = useAuth();
    const apiClient = useApiClient();
    const router = useRouter();
    const params = useParams();
    const rulesetId = params?.rulesetId as string;
    const businessId = user?.businessId;

    const [processes, setProcesses] = useState<AuditProcess[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!businessId || !rulesetId) return;
        setLoading(true);
        setError(null);

        if (user.role !== "ExternalAuditor") {

            apiClient
                .get<{ data: AuditProcess[] }>(`/audits/afpi/auditProcesses/getAll?businessId=${businessId}&rulesetId=${rulesetId}`)
                .then((res) => {
                    // Ordenar por fecha de inicio descendente
                    const sorted = [...(res.data || [])].sort((a, b) =>
                        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                    );
                    setProcesses(sorted);
                })
                .catch(() => {
                    setError("Error fetching audit processes");
                })
                .finally(() => setLoading(false));
        } else {
            apiClient
                .get<{ data: AuditProcess[] }>(`/audits/api/`)
                .then((res) => {
                    // Filtrar: solo procesos NOT_EVALUATED donde el usuario es auditor externo
                    const filtered = (res.data || []).filter(proc => {
                        const isNotEvaluated = proc.status === "NOT_EVALUATED";
                        const extAuditors = Array.isArray(proc.assignedExtAuditors) ? proc.assignedExtAuditors : [];
                        const isUserExternal = extAuditors.some(aud => aud._id === user._id);
                        return isNotEvaluated && isUserExternal;
                    });
                    // Ordenar por fecha de inicio descendente
                    const sorted = [...filtered].sort((a, b) =>
                        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                    );
                    setProcesses(sorted);
                })
                .catch(() => {
                    setError("Error fetching audit processes");
                })
                .finally(() => setLoading(false));
        }

    }, [businessId, rulesetId, user?.role, user?._id]);

    if (!businessId) return <div className="p-8 text-center">No businessId found in user session.</div>;
    if (loading) return <div className="p-8 text-center">Loading audit processes...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-primary-color tracking-tight drop-shadow-sm">
          Audit Processes
        </h1>
        {processes.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 py-16">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mb-4 opacity-60">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-7 4h10a2 2 0 002-2V7a2 2 0 00-2-2h-3.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0010.586 3H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-lg font-medium">No Non Evaluated Audit Processes found.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {processes.map((proc) => (
              <Card
                key={proc._id}
                className="p-5 cursor-pointer border border-primary-color/60 bg-white hover:bg-primary-color/10 hover:shadow-lg transition rounded-xl group"
                onClick={() => router.push(`/audits/processes/${rulesetId}/${proc._id}`)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-color/10 group-hover:bg-primary-color/20 transition">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary-color">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-primary-color group-hover:underline tracking-tight">{proc._id}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block align-middle">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10m-11 8a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12z" />
                        </svg>
                        {proc.startDate ? new Date(proc.startDate).toLocaleString() : "-"}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 min-w-[120px]">
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={proc.status === 'EVALUATED' ? 'text-green-500' : 'text-yellow-500'}>
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <circle cx="12" cy="12" r="5" fill={proc.status === 'EVALUATED' ? '#22c55e' : '#facc15'} />
                      </svg>
                      <span className={proc.status === 'EVALUATED' ? 'text-green-600' : 'text-yellow-600'}>
                        {proc.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {proc.assesments?.length ?? 0} assessments
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
}