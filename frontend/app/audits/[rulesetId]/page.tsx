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
        apiClient
            .get<{ data: AuditProcess[] }>(`audits/api/auditProcesses/getAll?businessId=${businessId}&rulesetId=${rulesetId}`)
            .then((res) => {
                // Ordenar por fecha de inicio descendente
                const sorted = [...(res.data || [])].sort((a, b) =>
                    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                );
                setProcesses(sorted);
            })
            .catch((err) => {
                setError("Error fetching audit processes");
            })
            .finally(() => setLoading(false));
    }, [businessId, rulesetId]);

    if (!businessId) return <div className="p-8 text-center">No businessId found in user session.</div>;
    if (loading) return <div className="p-8 text-center">Loading audit processes...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Audit Processes</h1>
            {processes.length === 0 ? (
                <div className="text-center text-gray-500">No audit processes found.</div>
            ) : (
                <div className="flex flex-col gap-4">
                    {processes.map((proc) => (
                        <Card
                            key={proc._id}
                            className="p-4 cursor-pointer hover:bg-primary-color/10 border border-primary-color transition"
                            onClick={() => router.push(`/audits/${rulesetId}/${proc._id}`)}
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div>
                                    <div className="font-semibold">{proc._id}</div>
                                    <div className="text-sm text-gray-500">Start: {proc.startDate ? new Date(proc.startDate).toLocaleString() : "-"}</div>
                                    <div className="text-sm text-gray-500">Status: {proc.status}</div>
                                </div>
                                <div className="text-xs text-gray-400">{proc.assesments?.length ?? 0} assessments</div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}