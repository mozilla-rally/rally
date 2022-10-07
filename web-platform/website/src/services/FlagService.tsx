import React, { createContext, useContext } from "react";

import { Flag } from "./Flag";

export interface FlagServiceDataContext {
  isFlagActive(flag: Flag): boolean;
  setFlag(flag: Flag, isActive: boolean): void;
}

const FlagContext = createContext<FlagServiceDataContext>(
  {} as FlagServiceDataContext
);

export function useFlagService() {
  return useContext(FlagContext);
}

export function FlagProvider(props: { children: React.ReactNode }) {
  function isFlagActive(flag: Flag): boolean {
    const flagsStr = localStorage.getItem("flags");

    if (!flagsStr || !flagsStr.trim()) {
      return flag.defaultValue;
    }

    const parsedFlags: Record<string, boolean> = JSON.parse(flagsStr) || {};

    const presentValue = parsedFlags[flag.name];

    return presentValue !== undefined ? presentValue : flag.defaultValue;
  }

  function setFlag(flag: Flag, isActive: boolean): void {
    const flagsStr = localStorage.getItem("flags");

    const parsedFlags: Record<string, boolean> =
      flagsStr && flagsStr.trim() ? JSON.parse(flagsStr) : {};

    if (isActive) {
      parsedFlags[flag.name] = true;
    } else {
      delete parsedFlags[flag.name];
    }

    localStorage.setItem("flags", JSON.stringify(parsedFlags));
  }

  return (
    <FlagContext.Provider value={{ isFlagActive, setFlag }}>
      {props.children}
    </FlagContext.Provider>
  );
}
