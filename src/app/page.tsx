import { UploadForm } from "@/components/UploadForm";
import { Logo } from "@/components/Logo";
import { SampleResult } from "@/components/SampleResult";
import { CyclingWord } from "@/components/CyclingWord";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-background/75 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3.5">
          <a href="#top" className="flex items-center gap-2.5">
            <Logo className="h-7 w-7" />
            <span className="text-base font-semibold tracking-tight">
              PolicyScanner
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-muted sm:flex">
            <a href="#how" className="transition hover:text-foreground">
              How it works
            </a>
            <a href="#why" className="transition hover:text-foreground">
              Why
            </a>
            <a href="#faq" className="transition hover:text-foreground">
              FAQ
            </a>
          </nav>
          <a
            href="#scan"
            className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition hover:opacity-90"
          >
            Scan a policy
          </a>
        </div>
      </header>

      <section
        id="top"
        className="relative overflow-hidden border-b border-border"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-gradient-to-b from-brand/8 to-transparent" />
        <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Beta · UK home insurance
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Compare on{" "}
              <CyclingWord />
              <br className="hidden sm:block" /> not just price.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">
              Upload any UK home insurance document — policy, quote or renewal
              — and see what you&rsquo;re actually covered for. The bits
              comparison sites quietly skip.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#scan"
                className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
              >
                Scan your policy
                <span aria-hidden className="ml-2">
                  →
                </span>
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition hover:border-brand/40"
              >
                How it works
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Check /> No signup
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check /> Free in beta
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check /> Nothing stored
              </span>
            </div>
          </div>

          <div className="relative lg:pl-6">
            <SampleResult />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-6 py-9">
          <p className="mb-5 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            Reads policies from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-medium text-muted">
            <span>Aviva</span>
            <span>Direct Line</span>
            <span>Admiral</span>
            <span>Hastings</span>
            <span>LV=</span>
            <span>NFU Mutual</span>
            <span>Churchill</span>
            <span>Halifax</span>
            <span className="text-foreground/60">+ any UK insurer</span>
          </div>
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-24 px-6 py-20">
        <section id="scan" className="w-full scroll-mt-24">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Scan a policy
            </h2>
            <p className="mt-2 text-sm text-muted">
              PDF, scanned image, IPID or full wording — drop it in.
            </p>
          </div>
          <div className="flex justify-center">
            <UploadForm />
          </div>
        </section>

        <section id="how" className="w-full scroll-mt-24">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              How it works
            </h2>
            <p className="mt-2 text-sm text-muted">
              Three steps. No account. No data retention.
            </p>
          </div>
          <div className="grid w-full gap-5 sm:grid-cols-3">
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
          </div>
        </section>

        <section id="why" className="w-full scroll-mt-24">
          <div className="grid gap-5 sm:grid-cols-3">
            <Feature
              title="Every cover line"
              body="Buildings, contents, excesses, sums insured, endorsements, exclusions — extracted into structured fields."
            />
            <Feature
              title="Cover gap detection"
              body="Compare year-on-year or against a new quote. We flag what's been dropped, capped or excluded."
            />
            <Feature
              title="Plain English"
              body="No more 'subject to the provisions of clause 4.7'. We translate the small print into something readable."
            />
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-card p-8 sm:p-10">
            <h3 className="text-xl font-semibold tracking-tight">
              Why this exists
            </h3>
            <p className="mt-3 max-w-3xl text-pretty leading-relaxed text-muted">
              Comparison sites optimise for price. Cover gets quietly trimmed —
              lower sums insured, missing accidental damage, higher excesses,
              sneaky exclusions. PolicyScanner pulls the cover out of your
              documents in plain English so you can compare like-for-like.
            </p>
          </div>
        </section>

        <section id="faq" className="w-full scroll-mt-24">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight">
              Common questions
            </h2>
          </div>
          <div className="space-y-3">
            <Faq
              q="Is my document stored?"
              a="No. Files stay on the server only long enough to extract text. No retention, no sharing, no training data."
            />
            <Faq
              q="Which insurers does this work with?"
              a="Any UK home insurance document — policy schedule, IPID, renewal letter, or full policy wording. We've tested with the major insurers and brokers; format-agnostic parsing handles the rest."
            />
            <Faq
              q="Is this regulated financial advice?"
              a="No. PolicyScanner is a parsing and comparison tool, not financial advice. It helps you see what's in your documents, but the choice is yours. For advice, speak to an FCA-regulated broker."
            />
            <Faq
              q="How much does it cost?"
              a="Free during beta. Long-term, we plan to earn commission only when you choose to switch through us — never from your data."
            />
          </div>
        </section>

        <section className="w-full rounded-3xl border border-border bg-gradient-to-br from-brand/10 via-card to-card p-10 text-center sm:p-14">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            See what your policy actually covers.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Takes under two minutes. No signup required.
          </p>
          <a
            href="#scan"
            className="mt-7 inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
          >
            Scan a policy
            <span aria-hidden className="ml-2">
              →
            </span>
          </a>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Logo className="h-6 w-6" />
              <span className="text-sm font-semibold">PolicyScanner</span>
            </div>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted">
              Cover match, not just the cheapest. UK home insurance parsing &
              comparison.
            </p>
          </div>
          <FooterCol
            heading="Product"
            links={[
              { label: "How it works", href: "#how" },
              { label: "Why", href: "#why" },
              { label: "FAQ", href: "#faq" },
              { label: "Scan a policy", href: "#scan" },
            ]}
          />
          <FooterCol
            heading="Company"
            links={[
              {
                label: "hello@policyscanner.co.uk",
                href: "mailto:hello@policyscanner.co.uk",
              },
            ]}
          />
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Legal
            </h4>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              PolicyScanner is a parsing tool, not regulated financial advice.
            </p>
            <p className="mt-3 text-xs text-muted">
              © {new Date().getFullYear()} PolicyScanner
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-6 transition hover:border-brand/40">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
        {n}
      </div>
      <div className="mt-4 text-base font-semibold tracking-tight">{title}</div>
      <div className="mt-1.5 text-sm leading-relaxed text-muted">{body}</div>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="text-base font-semibold tracking-tight">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-muted">{body}</div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-2xl border border-border bg-card p-5 transition hover:border-brand/30">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium">
        {q}
        <span
          aria-hidden
          className="text-muted transition group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-muted">{a}</p>
    </details>
  );
}

function FooterCol({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
        {heading}
      </h4>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="text-foreground/80 hover:underline">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Check() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="text-emerald-600 dark:text-emerald-500"
    >
      <path
        d="M2.5 7.5 L5.5 10.5 L11.5 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
