export interface Audit {
  name: string;
  rulesetId: string;
  status: string;
  startDate: Date;
  endDate: Date;
}

export enum AuditStatus {
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}
