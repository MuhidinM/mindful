"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  const onLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onLogout}
      className="rounded-lg border-input bg-surface-lowest text-foreground hover:bg-surface-high"
    >
      Log out
    </Button>
  );
}
