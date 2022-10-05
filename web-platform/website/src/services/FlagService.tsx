import React, { createContext, useContext } from "react";

export interface FlagServiceDataContext {
  isFlagActive(flag: string): boolean;
  setFlag(flag: string, isActive: boolean): void;
}

const FlagContext = createContext<FlagServiceDataContext>(
  {} as FlagServiceDataContext
);

export function useFlagService() {
  return useContext(FlagContext);
}

export function FlagProvider(props: { children: React.ReactNode }) {
  function isFlagActive(flag: string): boolean {
    const flagsStr = localStorage.getItem("flags");

    if (!flagsStr || !flagsStr.trim()) {
      return false;
    }

    const parsedFlags: Record<string, boolean> = JSON.parse(flagsStr) || {};

    return parsedFlags && parsedFlags[flag];
  }

  function setFlag(flag: string, isActive: boolean): void {
    const flagsStr = localStorage.getItem("flags");

    const parsedFlags: Record<string, boolean> =
      flagsStr && flagsStr.trim() ? JSON.parse(flagsStr) : {};

    if (isActive) {
      parsedFlags[flag] = true;
    } else {
      delete parsedFlags[flag];
    }

    localStorage.setItem("flags", JSON.stringify(parsedFlags));
  }

  return (
    <FlagContext.Provider value={{ isFlagActive, setFlag }}>
      {props.children}
    </FlagContext.Provider>
  );
}
