import React from "react";
import { RoutineSelector } from "./containers/RoutineSelector";
import { ParameterType, RoutinePath, ValuesByParameter } from "./types/Routines";
import "./App.scss";

const paths: RoutinePath[] = [
  { from: "meals", to: ["healthinnes", "amounts"] as ParameterType[] },
  { from: "pisses", to: ["amounts", "colors"] as ParameterType[] },
];

const valuesByParameter: ValuesByParameter = {
  amounts: ["a little", "medium amount", "a lot"],
  colors: ["dark yellow", "yello", "light yello", "transparent"],
  healthinnes: ["toxic", "unhealthy", "unnotriente", "healthy", "very healthy"],
};

export default function App() {
  return <RoutineSelector paths={paths} valuesByParameter={valuesByParameter} />;
}
