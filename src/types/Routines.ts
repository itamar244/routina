export type ParameterType = string;

export interface RoutinePath {
  from: string;
  to: ParameterType[];
}

export type ValuesByParameter = Record<ParameterType, string[]>;