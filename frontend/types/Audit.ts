export interface Audit {
  name: string;
  rulesetId: string;
  status: AuditStatus;
  startDate: Date;
  endDate: Date;
}

export enum AuditStatus {
  IN_PROGRESS,
  COMPLETED,
  CANCELLED,
}

export interface AuditProcess {
  _id: string;
  businessId: string;
  rulesetId: string;
  status: string;
  assignedIntAuditors: Inspector[];
  assignedExtAuditors: Inspector[];
  assesment: Assesment;
  startDate: string | Date;
  endDate: string | Date;
}

export enum ProcessStatus {
  NOT_EVALUATED,
  EVALUATED,
  CANCELED,
}

export interface Inspector {
  _id: string;
  name: string;
}

export interface Assesment {
  controlId: string;
  status: AssesmentStatus;
  assesedIn: string | Date;
  internalAuditor: Inspector;
  externalAuditor: Inspector;
  comment: string;
}

export enum AssesmentStatus {
  NOT_EVALUATED,
  EVALUATED,
}
