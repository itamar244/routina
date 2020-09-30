export type ParameterType = string;

export interface RoutinePath {
  from: string;
  to: ParameterType[];
}

export type ValuesByParameter = Record<ParameterType, { name: string; value: any }[]>;

export interface RoutineInfo {
  routineName: string;
  parameters: Record<string, any>;
}

export interface Routine {
  info: RoutineInfo;
  date: Date;
}
