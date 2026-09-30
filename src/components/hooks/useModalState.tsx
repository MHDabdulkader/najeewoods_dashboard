import { useState } from "react";

type BooleanState = Record<string, boolean>;
type BooleanStateUpdater<T extends BooleanState> = <K extends keyof T>(
  key: K,
  value: boolean
) => void;

export function useModalState<T extends BooleanState>(
  initialState: T
): [T, BooleanStateUpdater<T>] {
  const [state, setState] = useState<T>(initialState);

  const updateState: BooleanStateUpdater<T> = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  return [state, updateState] as const;
}

//  ======= use Global State =======
type AnyState = Record<string, any>;
type StateUpdater<T extends AnyState> = <K extends keyof T>(
  key: K,
  value: T[K]
) => void;

export function useGlobalState<T extends AnyState>(
  initialState: T
): [T, StateUpdater<T>] {
  const [global, setGlobalState] = useState<T>(initialState);

  const updateGlobal: StateUpdater<T> = (key, value) => {
    setGlobalState((prev) => ({ ...prev, [key]: value }));
  };

  return [global, updateGlobal] as const;
}
