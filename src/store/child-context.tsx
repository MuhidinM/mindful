"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

export type ChildKey = "child1" | "child2";

type ChildTheme = {
  key: ChildKey;
  label: string;
  colorName: "Teal" | "Coral";
  activeToggleClass: string;
  mutedToggleClass: string;
  accentTextClass: string;
  accentGradientClass: string;
  ringClass: string;
};

type ChildContextValue = {
  activeChild: ChildTheme;
  selectedChild: ChildKey;
  setSelectedChild: (child: ChildKey) => void;
  childOptions: ChildTheme[];
};

const childThemes: Record<ChildKey, ChildTheme> = {
  child1: {
    key: "child1",
    label: "Naif",
    colorName: "Teal",
    activeToggleClass: "bg-primary text-primary-foreground",
    mutedToggleClass: "bg-surface-high text-muted-foreground",
    accentTextClass: "text-primary",
    accentGradientClass: "bg-signature-teal",
    ringClass: "ring-primary/35",
  },
  child2: {
    key: "child2",
    label: "Hamza",
    colorName: "Coral",
    activeToggleClass: "bg-secondary text-secondary-foreground",
    mutedToggleClass: "bg-surface-high text-muted-foreground",
    accentTextClass: "text-secondary",
    accentGradientClass: "bg-signature-coral",
    ringClass: "ring-secondary/35",
  },
};

const ChildContext = createContext<ChildContextValue | undefined>(undefined);

export function ChildProvider({ children }: { children: ReactNode }) {
  const [selectedChild, setSelectedChild] = useState<ChildKey>("child1");

  const value = useMemo<ChildContextValue>(() => {
    return {
      activeChild: childThemes[selectedChild],
      selectedChild,
      setSelectedChild,
      childOptions: [childThemes.child1, childThemes.child2],
    };
  }, [selectedChild]);

  return <ChildContext.Provider value={value}>{children}</ChildContext.Provider>;
}

export function useChild() {
  const context = useContext(ChildContext);
  if (!context) {
    throw new Error("useChild must be used within ChildProvider.");
  }

  return context;
}
