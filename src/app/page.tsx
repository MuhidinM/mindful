import { LogoutButton } from "@/components/logout-button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-surface-low px-4 py-8">
      <section className="rounded-lg bg-surface-lowest p-6 shadow-(--shadow-ambient)">
        <p className="text-label-md text-muted-foreground">Phase 2</p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">
          Authentication is active
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Routes are now protected by middleware. Next step is Phase 3 after you
          validate login/logout behavior.
        </p>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </section>
    </main>
  );
}
