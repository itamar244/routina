import React, { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ParameterType, Routine, ValuesByParameter } from "../../types/Routines";
import { groupBy, keyBy, mapValues } from "../../utils";

function summarizeValuesByDate(
  routines: Routine[],
  parameterType: string,
  valuesByParameter: ValuesByParameter,
) {
  const parameterValues = keyBy(valuesByParameter[parameterType], value => value.name);
  const byDate = groupBy(routines, routine => new Date(routine.date).toLocaleDateString());
  const reduced = mapValues(byDate, routinesOfDate =>
    mapValues(
      parameterValues,
      parameterValue =>
        routinesOfDate.filter(
          routine => routine.info.parameters[parameterType] === parameterValue.value,
        ).length,
    ),
  );

  return Object.entries(reduced).map(([date, value]) => ({ name: date, ...value }));
}

export interface SumParameterValuesStatsProps {
  routines: Routine[];
  selectedRoutineName: string;
  valuesByParameter: ValuesByParameter;
  parameterType: ParameterType;
}

export function SumParameterValuesStats({
  routines,
  selectedRoutineName,
  valuesByParameter,
  parameterType,
}: SumParameterValuesStatsProps) {
  const currentRoutines = useMemo(
    () => routines.filter(routine => routine.info.routineName === selectedRoutineName),
    [routines, selectedRoutineName],
  );

  return (
    <ResponsiveContainer height={300} width="90%">
      <LineChart data={summarizeValuesByDate(currentRoutines, parameterType, valuesByParameter)}>
        <Legend />
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey={valuesByParameter[parameterType][0].name} stroke="#8884d8" />
        <Line type="monotone" dataKey={valuesByParameter[parameterType][1].name} stroke="#82ca9d" />
        <Line type="monotone" dataKey={valuesByParameter[parameterType][2].name} stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}
