"use client";

import { createContext, useContext } from "react";

export type TopbarConfig = {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
};

const TopbarContext = createContext<{
  setTopbar: (config: TopbarConfig) => void;
} | null>(null);

export const TopbarProvider = TopbarContext.Provider;

export function useTopbar() {
  const ctx = useContext(TopbarContext);
  if (!ctx) throw new Error("useTopbar must be used inside TopbarProvider");
  return ctx;
}