import React, { DOMAttributes, MouseEventHandler, PropsWithChildren, useCallback, useState } from "react";
import "./App.css";

function DraggableButton({
  id,
  children,
  isSelected,
}: PropsWithChildren<{ id: string; isSelected: boolean }>) {
  return (
    <button data-item-id={id} className={`item-button ${isSelected ? "selected" : ""}`}>
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

const rows = [
  ["meals", "pisses"],
  ["3", "6"],
];

export default function App() {
  const { capturing, startCapture, stopCapture } = useCapture();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const onHover: MouseEventHandler = useCallback(
    (event) => {
      const itemId = (event.target as HTMLElement).dataset?.itemId;

      if (itemId != null && !selectedIds.includes(itemId)) {
        setSelectedIds((selectedIds) => selectedIds.concat(itemId));
      }
    },
    [selectedIds, setSelectedIds],
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
        {rows.map((columns, i) => (
          <div key={i}>
            {columns.map((column) => (
              <DraggableButton key={column} id={column} isSelected={selectedIds.includes(column)}>
                {column}
              </DraggableButton>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
