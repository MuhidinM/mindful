"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.set("password", password);

    const response = await fetch("/api/login", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      setError("Invalid password. Please try again.");
      setIsSubmitting(false);
      return;
    }

    router.replace("/");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-low px-4 py-8">
      <section className="glass-panel ghost-border w-full max-w-sm rounded-xl p-6 shadow-(--shadow-ambient)">
        <h1 className="text-2xl font-semibold text-foreground">Mindful Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the app password to continue.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-2">
            <span className="text-label-md text-foreground">App Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg bg-surface-low px-3 py-2 text-foreground ghost-border focus:bg-surface-lowest focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </label>

          {error ? <p className="text-sm text-secondary">{error}</p> : null}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-signature-teal text-primary-foreground hover:opacity-95"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </section>
    </main>
  );
}
