// Define la interfaz para los controles dentro de un Ruleset
export interface Control {
  controlId: string;
  title: string;
  description: string;
  suitability: string;
  cycleStage: PHVAPhase;
  compulsoriness: string; //! Se deja como string para evitar problemas de serialización
}

// Enum para las fases PHVA
export enum PHVAPhase {
  PLAN = "PLAN",
  DO = "DO",
  CHECK = "CHECK",
  ACT = "ACT",
}

// Define la interfaz para el modelo Ruleset
export interface Ruleset {
  _id?: string;
  version: string;
  name: string;
  organization: string;
  publishingDate: Date;
  status: string;
  fileUrl:string;
  controls: Control[];
}
