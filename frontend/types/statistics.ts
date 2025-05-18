export interface TrendCompliances {
  fecha: string;
  cantidadConformidades: number;
}

export interface ApiAudit {
  conformityProcess: number;
  nonConformityProcess: number;
  phvaInformities: PhvaInformities;
  createdAt: string;
}

export interface AuditApiResponse {
  totalAudits: number;
  totalAuditsActive: number;
  auditsWithMostProcesses: {
    _id: string;
    name: string;
  };
  meanAuditTime: number;
  audits: ApiAudit[];
}

export type PhvaInformities = {
  plan: number
  doPhase: number
  check: number
  act: number
}

export type AuditData = {
  rulesetName: string
  conformityProcess: number
  nonConformityProcess: number
  phvaInformities: {
    plan: number
    doPhase: number
    check: number
    act: number
  }
  conformityTendency: TrendCompliances[]
}

export type StatisticsData = {
  totalAudits: number
  totalAuditsActive: number
  auditsWithMostProcesses: any | null
  meanAuditTime: number
  audits: AuditData[]
}