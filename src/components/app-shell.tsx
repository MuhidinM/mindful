"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { BottomNav } from "@/components/bottom-nav";
import { TopChildToggle } from "@/components/top-child-toggle";
import { ChildProvider } from "@/store/child-context";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isLoginRoute = pathname === "/login";

  if (isLoginRoute) {
    return <>{children}</>;
  }

  return (
    <ChildProvider>
      <div className="mx-auto min-h-screen w-full max-w-md bg-surface pb-24">
        <TopChildToggle />
        <main className="px-4 py-6">{children}</main>
        <BottomNav />
      </div>
    </ChildProvider>
  );
}
