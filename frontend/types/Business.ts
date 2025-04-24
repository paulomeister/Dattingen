import { Audit } from "./Audit";

export type AssociateRole = "Coordinator" | "InternalAuditor";

export interface Associate {
  userId: string;
  role: AssociateRole;
}

export interface Business {
  name: string;
  activity: string;
  associates: Associate[];
  audits: Audit[];
}
