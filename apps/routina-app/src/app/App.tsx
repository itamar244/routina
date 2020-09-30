import React, { useCallback, useEffect } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import type {
  ParameterType,
  Routine,
  RoutineInfo,
  RoutinePath,
  ValuesByParameter,
} from "@routina/models";

import { RoutineSelector } from "./containers/RoutineSelector";
import { useStorageState } from "./hooks/useStorageState";
import logo from "./logo.png";
import "./App.scss";
import { NumericValuesStats } from "./containers/RoutineStats/NumericValuesStats";

const paths: RoutinePath[] = [
  { from: "meals", to: ["healthinnes", "amounts"] as ParameterType[] },
  { from: "pisses", to: ["amounts", "colors"] as ParameterType[] },
];

const toValue = (arr: string[]) => arr.map((item, i) => ({ name: item, value: i + 1 }));

const valuesByParameter: ValuesByParameter = {
  amounts: toValue(["a little", "medium amount", "a lot"]),
  colors: toValue(["dark yellow", "yello", "light yello", "transparent"]),
  healthinnes: toValue(["toxic", "unhealthy", "unnotriente", "healthy", "very healthy"]),
};

export default function App() {
  const [routines, setRoutines] = useStorageState<Routine[]>("routines", []);
  const addRoutine = useCallback(
    (newRoutine: RoutineInfo) =>
      setRoutines(routines =>
        routines.concat({
          info: newRoutine,
          date: new Date(),
        }),
      ),
    [setRoutines],
  );
  useEffect(() => {
    console.log(routines);
  }, [routines]);

  return (
    <div className="app">
      <BrowserRouter>
        <header className="app__header">
          <img src={logo} alt="Logo" />
          <h1>Routine</h1>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/stats">Stats</Link>
            </li>
          </ul>
        </header>

        <main className="app__content">
          <Switch>
            <Route path="/stats">
              <NumericValuesStats routines={routines} selectedRoutineName="meals" />
              <NumericValuesStats routines={routines} selectedRoutineName="pisses" />
            </Route>
            <Route path="/">
              <RoutineSelector
                paths={paths}
                valuesByParameter={valuesByParameter}
                onRoutinaSelected={addRoutine}
              />
            </Route>
          </Switch>
        </main>
      </BrowserRouter>
    </div>
  );
}
