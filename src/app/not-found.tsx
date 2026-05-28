import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border bg-background/75 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-3.5">
          <a href="/" className="flex items-center gap-2.5">
            <Logo className="h-7 w-7" />
            <span className="text-base font-semibold tracking-tight">
              PolicyScanner
            </span>
          </a>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="text-7xl font-semibold tracking-tight text-brand sm:text-8xl">
          404
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-muted">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
          The cover, however, is still right here.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
          >
            Back to PolicyScanner
            <span aria-hidden className="ml-2">
              →
            </span>
          </a>
          <a
            href="/#scan"
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition hover:border-brand/40"
          >
            Scan a policy
          </a>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-8 text-xs text-muted">
          © {new Date().getFullYear()} PolicyScanner ·{" "}
          <a href="/privacy" className="hover:underline">
            Privacy
          </a>
        </div>
      </footer>
    </div>
  );
}
