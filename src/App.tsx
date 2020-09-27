import React, { MouseEventHandler, PropsWithChildren, useCallback, useMemo, useState } from "react";
import classnames from "classnames";
import "./App.scss";

type DragableButtonProps = PropsWithChildren<{
  id: string;
  isSelected: boolean;
}>;

function StyledButton({ id, children, isSelected }: DragableButtonProps) {
  const className = classnames("item-button", {
    selected: isSelected,
  });
  return (
    <button data-item-id={id} className={className}>
      {children}
    </button>
  );
}

function useCapture() {
  const [capturing, setCapturing] = useState(false);
  const startCapture = useCallback(() => {
    setCapturing(true);
  }, [setCapturing]);
  const stopCapture = useCallback(() => {
    setCapturing(false);
  }, [setCapturing]);

  return { capturing, startCapture, stopCapture };
}

type ParameterType = keyof typeof valuesByParameter;
const paths: { from: string; to: ParameterType[] }[] = [
  { from: "meals", to: ["healthinnes", "amounts"] },
  { from: "pisses", to: ["amounts", "colors"] },
];

const valuesByParameter = {
  amounts: ["a little", "medium amount", "a lot"],
  colors: ["dark yellow", "yello", "light yello", "transparent"],
  healthinnes: ["toxic", "unhealthy", "unnotriente", "healthy", "very healthy"],
};

export default function App() {
  const { capturing, startCapture, stopCapture } = useCapture();
  const [pathName, setPathName] = useState<string | null>(null);
  const [currentRowIndex, setCurrentRowIndex] = useState<number>(0);
  const [selectedNodes, setSelectedNodes] = useState<Partial<Record<string, string>>>({});
  const pathsByPathName = useMemo(
    () => Object.fromEntries(paths.map(path => [path.from, path.to])),
    [],
  );
  const onHover: MouseEventHandler = useCallback(
    event => {
      const itemId = (event.target as HTMLElement).dataset?.itemId;

      if (itemId == null) {
        return;
      }

      if (paths.some(path => path.from === itemId)) {
        setPathName(itemId);
        return;
      }

      const parameter = pathsByPathName[pathName!][currentRowIndex];
      if (valuesByParameter[parameter]?.includes(itemId)) {
        setSelectedNodes(nodes => ({ ...nodes, [parameter]: itemId }));
        setCurrentRowIndex(id => id + 1);
      }
    },
    [currentRowIndex, pathName, pathsByPathName],
  );

  return (
    <div className="App">
      <header className="App-header">Routina</header>
      <p>asdfasdf</p>
      <section
        className="button-containers"
        onMouseMove={capturing ? onHover : undefined}
        onMouseDown={startCapture}
        onMouseUp={stopCapture}
      >
        <div className={classnames({ "row-hidden": pathName })}>
          {paths.map(path => (
            <StyledButton key={path.from} id={path.from} isSelected={pathName === path.from}>
              {path.from}
            </StyledButton>
          ))}
        </div>

        {pathName &&
          pathsByPathName[pathName].map((parameter, i) => (
            <div key={i} className={classnames({ "row-hidden": currentRowIndex !== i })}>
              {valuesByParameter[parameter].map(column => {
                const isSelected = selectedNodes[parameter] === column;
                console.log(selectedNodes, column);
                return (
                  <StyledButton key={column} id={column} isSelected={isSelected}>
                    {column}
                  </StyledButton>
                );
              })}
            </div>
          ))}
      </section>
    </div>
  );
}
