import React, {
  PropsWithChildren,
  TouchEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import classnames from "classnames";
import { RoutineInfo, RoutinePath, ValuesByParameter } from "../../types/Routines";
import "./RoutineSelector.scss";

type StyledButtonProps = PropsWithChildren<{
  id: string;
  isSelected: boolean;
}>;

function StyledButton({ id, children, isSelected }: StyledButtonProps) {
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
    console.log("setCapturing(true)");
    setCapturing(true);
  }, [setCapturing]);
  const stopCapture = useCallback(() => {
    console.log("setCapturing(false)");
    setCapturing(false);
  }, [setCapturing]);

  return { capturing, startCapture, stopCapture };
}

export interface RoutineSelectorProps {
  paths: RoutinePath[];
  valuesByParameter: ValuesByParameter;
  onRoutinaSelected?: (routine: RoutineInfo) => void;
}

export function RoutineSelector({
  paths,
  valuesByParameter,
  onRoutinaSelected: onRoutineSelected,
}: RoutineSelectorProps) {
  const { capturing, startCapture, stopCapture } = useCapture();
  const [pathName, setPathName] = useState<string | null>(null);
  const [currentRowIndex, setCurrentRowIndex] = useState<number>(0);
  const [selectedNodes, setSelectedParameters] = useState<Partial<Record<string, string>>>({});
  const pathsByPathName = useMemo(
    () => Object.fromEntries(paths.map(path => [path.from, path.to])),
    [paths],
  );

  const onHover: TouchEventHandler = useCallback(
    event => {
      const point = event.touches[0];
      const element = document.elementFromPoint(point.clientX, point.clientY) as HTMLElement;
      const itemId = element?.dataset?.itemId;

      if (itemId == null || !capturing) {
        return;
      }

      if (paths.some(path => path.from === itemId)) {
        setPathName(itemId);
        return;
      }

      const parameter = pathsByPathName[pathName!][currentRowIndex];
      const item = valuesByParameter[parameter]?.find(item => item.name === itemId);
      if (item) {
        setSelectedParameters(nodes => ({ ...nodes, [parameter]: item.value }));
        setCurrentRowIndex(id => id + 1);
      }
    },
    [capturing, currentRowIndex, pathName, pathsByPathName, paths, valuesByParameter],
  );

  useEffect(() => {
    if (pathName !== null && (pathsByPathName[pathName!]?.length === currentRowIndex ?? true)) {
      onRoutineSelected?.({
        routineName: pathName!,
        parameters: selectedNodes as Record<string, string>,
      });
      setPathName(null);
      setSelectedParameters({});
      setCurrentRowIndex(0);
    }
  }, [pathName, onRoutineSelected, pathsByPathName, currentRowIndex, selectedNodes]);

  return (
    <section
      className="routine-selectors"
      onTouchMove={onHover}
      onPointerDown={startCapture}
      onPointerUp={stopCapture}
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
            {valuesByParameter[parameter].map(({ name: column, value }) => {
              const isSelected = selectedNodes[parameter] === value;
              return (
                <StyledButton key={column} id={column} isSelected={isSelected}>
                  {column}
                </StyledButton>
              );
            })}
          </div>
        ))}
    </section>
  );
}
