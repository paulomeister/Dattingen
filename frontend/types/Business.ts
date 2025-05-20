import { Audit } from "./Audit";
import { StatisticsData } from "@/types/statistics";

export type AssociateRole = "Coordinator" | "InternalAuditor";

export interface Associate {
  _id: string;
  role: AssociateRole;
}

export interface Business {
  _id: string | null;
  name: string;
  activity: string;
  associates: Associate[];
  audits: Audit[];
}
