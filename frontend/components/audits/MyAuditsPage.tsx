"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Audit, AuditProcess } from "@/types/Audit";
import { useApiClient } from "@/hooks/useApiClient";
import { useAuth } from "@/lib/AuthContext";
import { ResponseDTO } from "@/types/ResponseDTO";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle } from "lucide-react";
import { Ruleset } from "@/types/Ruleset";
import { useLanguage } from "@/lib/LanguageContext";

// Define un tipo extendido para la UI
interface AuditWithId extends Audit {
  _id: string;
}

export function MyAuditsPage() {
  const [audits, setAudits] = useState<AuditWithId[]>([]);
  const apiClient = useApiClient();
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    // Evita el bucle infinito: solo ejecuta si user._id está definido
    if (!user?._id) return;
    const fetchBusinessAudits = async () => {
      try {
        const responseTwo = await apiClient.get<ResponseDTO<AuditProcess[]>>(
          `/audits/api/`
        );
        const userProcesses = (responseTwo.data || []).filter((proc) => {
          const intAuditors = Array.isArray(proc.assignedIntAuditors)
            ? proc.assignedIntAuditors
            : [];
          const extAuditors = Array.isArray(proc.assignedExtAuditors)
            ? proc.assignedExtAuditors
            : [];
          return (
            intAuditors.some((aud) => aud._id === user._id) ||
            extAuditors.some((aud) => aud._id === user._id) ||
            proc.businessId === user.businessId
          );
        });


        const audits: AuditWithId[] = await Promise.all(userProcesses.map(async (proc) => {
          let rulesetName = proc.rulesetId;
          try {
            const rulesetRes = await apiClient.get<Ruleset>(`/rulesets/api/findbyid/${proc.rulesetId}`);

            console.log("Ruleset response:", rulesetRes);
            if (rulesetRes && rulesetRes.name) {
              rulesetName = rulesetRes.name;
            }
          } catch { }
          return {
            _id: proc._id,
            name: rulesetName,
            rulesetId: proc.rulesetId,
            status:
              proc.status === "IN_PROGRESS"
                ? 0
                : proc.status === "COMPLETED"
                  ? 1
                  : 2,
            startDate: new Date(proc.startDate),
            endDate: new Date(proc.endDate),
          };
        }));
        setAudits(audits);
      } catch {
        setAudits([]);
      }
    };
    fetchBusinessAudits();
    // Solo depende de user._id y apiClient
  }, [user?._id, user?.businessId, apiClient]);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Main Content */}
      <main className="flex-1 space-y-10">
        {/* Audit Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {audits.map((audit, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg border transition flex flex-col gap-4"
            >
              <h4 className="text-xl font-semibold text-[var(--color-primary-color)] mb-1">
                {audit.name}
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                {t("audits.myAudits.status", "Status:")}{" "}
                <span className="capitalize font-medium text-gray-700">
                  {audit.status === 0
                    ? t("audits.myAudits.inProgress", "In Progress")
                    : audit.status === 1
                      ? t("audits.myAudits.completed", "Completed")
                      : t("audits.myAudits.other", "Other")}
                </span>
              </p>
              <div className="flex flex-col gap-2 mt-auto">
                <Link href={`/audits/processes/${audit.rulesetId}`} className="w-full">
                  <Button className="w-full flex items-center justify-center gap-2 bg-primary-color text-white hover:bg-secondary-color transition-all duration-200 shadow-md text-sm font-semibold rounded-xl py-2">
                    <FileText className="h-4 w-4" />
                    {t("audits.myAudits.details", "View details")}
                  </Button>
                </Link>
                {(user?.role === "Admin" ||
                  user?.role === "Coordinator") && (
                    <Link
                      href={`/audits/createAuditProcess/${audit.rulesetId}`}
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 border-primary-color text-primary-color hover:bg-primary-color hover:text-white transition-all duration-200 shadow text-sm font-semibold rounded-xl py-2"
                      >
                        <PlusCircle className="h-4 w-4" />
                        {t("audits.myAudits.createProcess")}
                      </Button>
                    </Link>
                  )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
