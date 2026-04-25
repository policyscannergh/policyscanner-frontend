import { UploadForm } from "@/components/UploadForm";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-accent" />
            <span className="text-base font-semibold tracking-tight">
              PolicyScanner
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted sm:flex">
            <a href="#how" className="hover:text-foreground">
              How it works
            </a>
            <a href="#why" className="hover:text-foreground">
              Why
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-12 px-6 py-12 sm:py-20">
        <section className="text-center">
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Cover match,{" "}
            <span className="text-brand">not just the cheapest.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-muted">
            Upload your home insurance document and instantly see what you&rsquo;re
            actually covered for. No more comparing on price alone.
          </p>
        </section>

        <UploadForm />

        <section
          id="how"
          className="grid w-full gap-6 border-t border-border pt-12 sm:grid-cols-3"
        >
          <Step
            n="1"
            title="Upload"
            body="Drop in your renewal schedule, quote, or full policy PDF."
          />
          <Step
            n="2"
            title="Parse"
            body="We extract sums insured, excesses, endorsements and exclusions."
          />
          <Step
            n="3"
            title="Compare"
            body="See your real cover side-by-side, not the headline price."
          />
        </section>

        <section
          id="why"
          className="rounded-2xl border border-border bg-card p-6 text-sm leading-relaxed text-muted sm:p-8"
        >
          <p>
            <span className="font-medium text-foreground">Why this exists.</span>{" "}
            Comparison sites optimise for price. Cover gets quietly trimmed —
            lower sums insured, missing accidental damage, higher excesses,
            sneaky exclusions. PolicyScanner pulls the cover out of your
            documents in plain English so you can compare like-for-like.
          </p>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} PolicyScanner ·{" "}
        <a href="mailto:hello@policyscanner.co.uk" className="hover:underline">
          hello@policyscanner.co.uk
        </a>
      </footer>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-2 text-xs font-semibold tracking-wider text-brand">
        STEP {n}
      </div>
      <div className="text-base font-semibold">{title}</div>
      <div className="mt-1 text-sm text-muted">{body}</div>
    </div>
  );
}
