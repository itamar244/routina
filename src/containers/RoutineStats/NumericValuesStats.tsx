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
import { Routine } from "../../types/Routines";
import { groupBy, keyBy, mapValues } from "../../utils";

function summarizeValuesByDate(routines: Routine[], parameterNames: string[]) {
  const byDate = groupBy(routines, routine => new Date(routine.date).toLocaleDateString());
  const reduced = mapValues(byDate, routinesOfDate =>
    mapValues(
      keyBy(parameterNames, name => name),
      parameterName =>
        routinesOfDate.reduce(
          (acc, routine) => (acc + routine.info.parameters[parameterName]) as number,
          0,
        ),
    ),
  );

  return Object.entries(reduced).map(([date, value]) => ({ name: date, ...value }));
}

export interface NumericValuesStatsProps {
  routines: Routine[];
  selectedRoutineName: string;
}

export function NumericValuesStats({ routines, selectedRoutineName }: NumericValuesStatsProps) {
  const currentRoutines = useMemo(
    () => routines.filter(routine => routine.info.routineName === selectedRoutineName),
    [routines, selectedRoutineName],
  );
  const parameterNames = useMemo(
    () => (currentRoutines.length > 0 ? Object.keys(currentRoutines[0].info.parameters) : []),
    [currentRoutines],
  );

  return (
    <>
      <h3 style={{ textAlign: "center" }}>{selectedRoutineName} per day</h3>
      <ResponsiveContainer height={300} width="90%">
        <LineChart height={300} data={summarizeValuesByDate(currentRoutines, parameterNames)}>
          <Legend></Legend>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line type="monotone" dataKey={parameterNames[0]} stroke="#8884d8" />
          <Line type="monotone" dataKey={parameterNames[1]} stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
