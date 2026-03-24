"use client";

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
      </div>
      <div className="mx-auto w-full max-w-md px-4 pb-3">
        <p className={`text-xs font-medium ${activeChild.accentTextClass}`}>
          Active profile: {activeChild.label} ({activeChild.colorName})
        </p>
      </div>
    </header>
  );
}
