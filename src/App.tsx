import React, { MouseEventHandler, PropsWithChildren, useCallback, useState } from "react";
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

const rowTypesOrder: (keyof typeof rows)[] = ["types", "amounts", "colors"];

const rows = {
  types: ["meals", "pisses"],
  amounts: ["a little", "medium amount", "a lot"],
  colors: ["dark yellow", "yello", "light yello", "transparent"],
};

export default function App() {
  const { capturing, startCapture, stopCapture } = useCapture();
  const [currentRowIndex, setCurrentRowIndex] = useState<number>(0);
  const [selectedIds, setSelectedIds] = useState<Partial<Record<keyof typeof rows, string>>>({});
  const onHover: MouseEventHandler = useCallback(
    event => {
      const itemId = (event.target as HTMLElement).dataset?.itemId;
      const currentRow = rowTypesOrder[currentRowIndex];

      if (itemId != null && rows[currentRow]?.includes(itemId)) {
        setSelectedIds(selectedIds => ({ ...selectedIds, [currentRow]: itemId }));
        setCurrentRowIndex(id => id + 1);
      }
    },
    [currentRowIndex],
  );
  console.log(selectedIds);

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
        {rowTypesOrder.map((rowType, i) => (
          <div key={i} className={classnames({"row-hidden": currentRowIndex !== i})}>
            {rows[rowType].map(column => {
              const isSelected = selectedIds[rowType] === column;
              return (
                <StyledButton
                  key={column}
                  id={column}
                  isSelected={isSelected}
                >
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
