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
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed inset-x-0 top-0 z-20 glass-panel h-20">
        <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-between px-6">
          <p className="font-heading text-xl font-bold tracking-tight text-primary">
            The Mindful Curator
          </p>
          <div className="size-9 rounded-full bg-surface-high" />
        </div>
      </nav>

      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 pb-12 pt-24">
        <section className="w-full max-w-md rounded-lg bg-surface-lowest p-8 shadow-(--shadow-ambient) ghost-border md:p-10">
          <header className="mb-8">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, curator.
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Enter your app password to continue.
            </p>
          </header>

          <form className="space-y-7" onSubmit={onSubmit}>
            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                App Password
              </span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border-0 border-b border-b-border bg-surface-low px-0 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-b-primary focus:outline-none focus:ring-0"
                placeholder="Enter your password"
                required
              />
            </label>

            {error ? <p className="text-sm text-secondary">{error}</p> : null}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-signature-teal py-6 text-sm font-bold tracking-wide text-primary-foreground hover:opacity-95"
            >
              {isSubmitting ? "Signing in..." : "Sign In to Dashboard"}
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}
