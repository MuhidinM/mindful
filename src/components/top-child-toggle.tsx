"use client";

import { Bell, CircleUserRound } from "lucide-react";

import { useChild } from "@/store/child-context";

export function TopChildToggle() {
  const { activeChild, childOptions, selectedChild, setSelectedChild } = useChild();

  return (
    <header className="sticky top-0 z-20 glass-panel">
      <div className="mx-auto flex h-20 w-full max-w-md items-center justify-between px-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Mindful Curator
          </p>
          <h1 className="font-heading text-lg font-extrabold text-foreground">
            Parent Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-surface-low hover:text-foreground"
          >
            <Bell className="size-4" />
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-surface-low hover:text-foreground"
          >
            <CircleUserRound className="size-4" />
          </button>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3 px-4 pb-3">
        <div className="flex items-center gap-2 rounded-full bg-surface-low p-1">
          {childOptions.map((child) => {
            const isActive = child.key === selectedChild;
            return (
              <button
                key={child.key}
                type="button"
                onClick={() => setSelectedChild(child.key)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${isActive ? child.activeToggleClass : child.mutedToggleClass}`}
              >
                {child.label}
              </button>
            );
          })}
        </div>
        <p className={`text-xs font-medium ${activeChild.accentTextClass}`}>
          {activeChild.label}: {activeChild.colorName}
        </p>
      </div>
    </header>
  );
}
