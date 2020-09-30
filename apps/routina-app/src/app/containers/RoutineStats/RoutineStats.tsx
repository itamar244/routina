import React, { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Routine } from "../../types/Routines";

export interface RoutineStatsProps {
  routines: Routine[];
  selectedRoutineName: string;
}

export function RoutineStats({ routines, selectedRoutineName }: RoutineStatsProps) {
  const currentRoutines = useMemo(
    () => routines.filter(routine => routine.info.routineName === selectedRoutineName),
    [routines, selectedRoutineName],
  );

  return (
    <LineChart
      width={500}
      height={300}
      data={currentRoutines.map(routine => routine.info.parameters)}
    >
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <Line type="monotone" dataKey="amounts" stroke="#8884d8" />
      <Line type="monotone" dataKey="healthinnes" stroke="#82ca9d" />
    </LineChart>
  );
}
