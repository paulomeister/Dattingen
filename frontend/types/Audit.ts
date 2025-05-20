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
  assesments: Assesment[];
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

export interface Evidence {
  description: string;
  url: string;
  addedDate: string | Date;
}

export interface Assesment {
  controlId: string;
  status: string;
  assesedIn: string | Date;
  internalAuditor: Inspector;
  externalAuditor: Inspector;
  evidence?: Evidence;
  comment: string;
}

export enum AssesmentStatus {
  PENDING,
  COMPLIANT,
  NON_COMPLIANT,
  NOT_DONE,
}
