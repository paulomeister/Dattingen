export interface TrendCompliances {
  fecha: string;
  cantidadConformidades: number;
}

export interface PhvaInformities {
  plan: number;
  doPhase: number;
  check: number;
  act: number;
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