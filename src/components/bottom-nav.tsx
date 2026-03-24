"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartNoAxesColumn, ClipboardCheck, History } from "lucide-react";

import { useChild } from "@/store/child-context";

const navItems = [
  { href: "/", label: "Dashboard", icon: ChartNoAxesColumn },
  { href: "/log", label: "Log Today", icon: ClipboardCheck },
  { href: "/history", label: "History", icon: History },
];

export function BottomNav() {
  const pathname = usePathname();
  const { activeChild } = useChild();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20">
      <div className="mx-auto w-full max-w-md px-4 pb-3">
        <div className="glass-panel ghost-border rounded-xl px-2 py-2 shadow-(--shadow-ambient)">
          <ul className="grid grid-cols-3 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold transition-colors ${
                      isActive
                        ? `${activeChild.accentTextClass} bg-surface-low`
                        : "text-muted-foreground hover:bg-surface-low"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
