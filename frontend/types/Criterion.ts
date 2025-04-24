export interface Criterion {
  controlId: string;
  title: string;
  description: string;
  cycleStage: CycleStageEnum;
  compulsoriness: Array<Compulsoriness>;
}

export interface Compulsoriness {
  id: string;
  term: string;
}

export enum CycleStageEnum {
  P = "P",
  D = "D",
  C = "C",
  A = "A",
}

export enum SuitabilityEnum {
  can = "can",
  may = "may",
  must = "must",
  shall = "shall",
  should = "should",
}
