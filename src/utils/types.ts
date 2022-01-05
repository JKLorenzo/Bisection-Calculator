export interface Options {
  ea?: string;
  range?: number;
  places?: number;
}

export type BracketFX = {
  x: number;
  fx: number;
};

export type BracketJSON = {
  x0: number;
  x1: number;
};

export type ResultJSON = {
  x0: number;
  x1: number;
  x2: number;
  fx2: number;
  Ea?: number;
};

export type BracketResult = {
  bracket: BracketJSON;
  results: ResultJSON[];
};

export type BisectionResult = {
  fx_limit_values?: BracketFX[];
  possible_brackets?: BracketJSON[];
  bracket_results?: BracketResult[];
};
