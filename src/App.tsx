import React, { DragEventHandler, MouseEventHandler, ReactNode, useCallback, useState } from "react";
import "./App.css";

function DraggableButton({ children }: { children?: ReactNode }) {
  const [position, setPosition] = useState<{
    x?: number;
    y?: number;
  }>({});
  const [isDragging, setIsDragging] = useState(false);
  const onDrag: DragEventHandler = useCallback(
    (event) => {
      event.preventDefault();
      setPosition({ x: event.clientX, y: event.clientY });
      setIsDragging(event.clientX !== 0 || event.clientY !== 0);
    },
    [setPosition, setIsDragging]
  );
  return (
    <button
      className="drag-option"
      draggable
      onDrag={onDrag}
      style={
        isDragging
          ? {
              position: "absolute",
              transform: "translate(-50%, -50%)",
              left: position.x,
              top: position.y,
            }
          : {}
      }
    >
      {children}
    </button>
  );
}

function DraggableOnHoverButton({ children }: { children?: ReactNode }) {
  const [position, setPosition] = useState<{
    x?: number;
    y?: number;
  }>({});
  const [isDragging, setIsDragging] = useState(false);
  const onDrag: MouseEventHandler = useCallback(
    (event) => {
      console.log(event.clientX);
      event.preventDefault();
      setPosition({ x: event.clientX, y: event.clientY });
      setIsDragging(event.clientX !== 0 || event.clientY !== 0);
    },
    [setPosition, setIsDragging]
  );
  return (
    <button
      className="drag-option"
      draggable
      onDrag={onDrag}
      style={
        isDragging
          ? {
              position: "absolute",
              transform: "translate(-50%, -50%)",
              left: position.x,
              top: position.y,
            }
          : {}
      }
    >
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div className="App">
      <header className="App-header">Routina</header>
      <p>asdfasdf</p>
      <div>
        <DraggableButton>meals</DraggableButton>
        <DraggableButton>pisses</DraggableButton>
      </div>
      <div>
        <DraggableOnHoverButton>3</DraggableOnHoverButton>
      </div>
    </div>
  );
}
