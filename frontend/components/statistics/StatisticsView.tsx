import StatisticsCarousel from "@/components/statistics/StatisticsCarrousel"
import { useApiClient } from "@/hooks/useApiClient";
import { AssesmentStatus, Audit, AuditProcess, AuditStatus, ProcessStatus } from "@/types/Audit";
import { Business } from "@/types/Business";
import { ResponseDTO } from "@/types/ResponseDTO";
import { AuditData, StatisticsData, TrendCompliances } from "@/types/statistics";
import { ChartColumn } from "lucide-react"
import { useEffect, useState } from "react";

interface BusinessDetailProps {
  business: Business;
}


function StatisticsView({ business }: BusinessDetailProps) {
  const apiClient = useApiClient();
  // Cambiar a useState
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const auditResponses: AuditProcess[][] = [];

        for (const audit of business.audits) {
          const response = await apiClient.get<ResponseDTO<AuditProcess[]>>(
            `/audits/api/auditProcesses/getAll?businessId=${business._id}&rulesetId=${audit.rulesetId}`
          );
          const auditsData: AuditProcess[] = response.data;
          auditResponses.push(auditsData);
        }

        console.log("Audits data:", auditResponses);

        const newStatisticsData : StatisticsData = buildStatisticsData(auditResponses);
        console.log("Statistics data:", newStatisticsData);
        setStatisticsData(newStatisticsData);
      } catch (err: unknown) {
        console.error("Error fetching data:", err);
      }
    }
    fetchData();
  }, [business._id]); // Remover statisticsData de las dependencias

  // Añadir loading state
  if (!statisticsData) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-2">
      <h1 className="flex items-center justify-center gap-4 scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl mb-8">
        <ChartColumn size={32} />
        Estadísticas de la Organización
      </h1>

      <div className="mb-12">
        <StatisticsCarousel data={statisticsData} />
      </div>
    </div>
  );
}

function buildStatisticsData(auditResponses: AuditProcess[][]): StatisticsData {
  // Initialize statistics data
  const statistics: StatisticsData = {
    totalAudits: 0,
    totalAuditsActive: 0,
    auditsWithMostProcesses: null,
    meanAuditTime: 0,
    audits: []
  };

  auditResponses.forEach(auditProcesses => {
    if (auditProcesses.length === 0) return;

    const audit = auditProcesses[0];
    const assesments = audit.assesments || [];

    // Calculate conformity statistics
    const totalControls = assesments.length;
    const compliantControls = assesments.filter(a => a.status == "COMPLIANT").length;
    const nonCompliantControls = assesments.filter(a => a.status == "COMPLIANT").length;

    // Calculate PHVA statistics
    const phvaInformities = {
      plan: 0,
      doPhase: 0,
      check: 0,
      act: 0
    };

    // Calculate conformity tendency
    const conformityTendency: TrendCompliances[] = [];
    if (audit.startDate && audit.endDate) {
      const startDate = new Date(audit.startDate);
      const endDate = new Date(audit.endDate);
      const conformityRate = (compliantControls / totalControls) * 100;
      
      conformityTendency.push({
        fecha: endDate.toISOString().split('T')[0],
        cantidadConformidades: compliantControls
      });
    }

    // Create audit data
    const auditData: AuditData = {
      rulesetName: audit.rulesetId, // You might want to fetch the actual ruleset name
      conformityProcess: totalControls > 0 ? (compliantControls / totalControls) * 100 : 0,
      nonConformityProcess: totalControls > 0 ? (nonCompliantControls / totalControls) * 100 : 0,
      phvaInformities,
      conformityTendency
    };

    statistics.audits.push(auditData);

    // Update global statistics
    statistics.totalAudits++;
    if (audit.status !== "EVALUATED" && audit.status !== "NOT_EVALUATED") {
      statistics.totalAuditsActive++;
    }

    // Calculate mean audit time
    if (audit.startDate && audit.endDate) {
      const start = new Date(audit.startDate);
      const end = new Date(audit.endDate);
      const hours = Math.abs(end.getTime() - start.getTime()) / 36e5; // Convert to hours
      statistics.meanAuditTime = (statistics.meanAuditTime * (statistics.totalAudits - 1) + hours) / statistics.totalAudits;
    }
  });

  return statistics;
}

export default StatisticsView;