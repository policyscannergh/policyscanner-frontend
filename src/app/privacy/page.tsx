import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Privacy — PolicyScanner",
  description:
    "How PolicyScanner handles your data. Short version: we don't store your documents and we don't track personal data.",
};

export default function PrivacyPage() {
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
          <a
            href="/"
            className="text-sm text-muted transition hover:text-foreground"
          >
            ← Back
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Privacy
        </h1>
        <p className="mt-4 text-sm text-muted">Last updated: May 2026</p>

        <section className="mt-10 space-y-6 text-base leading-relaxed text-foreground/85">
          <p>
            <span className="font-semibold text-foreground">Short version:</span>{" "}
            your uploaded documents are not stored. They live on our server only
            long enough to extract text, get parsed by Claude, and return a
            result. After that they&rsquo;re deleted. We don&rsquo;t log
            personal data and we don&rsquo;t sell anything.
          </p>

          <Section title="What we do with your document">
            <p>
              When you upload a policy, quote, or renewal PDF (or image, or
              text), our backend extracts the text using PDF tooling and OCR
              where needed. The extracted text is sent to Anthropic&rsquo;s
              Claude API for parsing into a structured format. The result is
              returned to your browser. The uploaded file and the extracted
              text are not written to long-term storage and are not retained
              past the request.
            </p>
          </Section>

          <Section title="Third parties involved">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-medium">Anthropic (Claude API)</span> —
                processes the extracted document text to produce structured
                output. Anthropic does not train on data sent via the API.
              </li>
              <li>
                <span className="font-medium">Railway</span> — hosts the
                backend that handles parsing.
              </li>
              <li>
                <span className="font-medium">Vercel</span> — hosts this
                website and provides anonymous traffic analytics (page views,
                country, device type — no IP addresses or personal identifiers
                stored).
              </li>
            </ul>
          </Section>

          <Section title="What we don't do">
            <ul className="list-disc space-y-2 pl-5">
              <li>We don&rsquo;t require an account.</li>
              <li>We don&rsquo;t track or store who uploaded what.</li>
              <li>
                We don&rsquo;t sell, share, or transmit your data to insurers,
                comparison sites, or advertisers.
              </li>
              <li>
                We don&rsquo;t use behavioural tracking cookies. The only
                analytics in use are anonymous and aggregated.
              </li>
            </ul>
          </Section>

          <Section title="Affiliate links">
            <p>
              PolicyScanner may include affiliate links to comparison sites
              like MoneySupermarket. If you click an affiliate link and choose
              to switch policies, we may earn a small commission at no cost to
              you. We don&rsquo;t pass any of your uploaded data to those
              partners.
            </p>
          </Section>

          <Section title="Status of this tool">
            <p>
              PolicyScanner is a parsing and comparison tool. It is{" "}
              <span className="font-medium">not</span> regulated financial
              advice. For advice, speak to an FCA-regulated broker.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions, deletion requests, or anything else —{" "}
              <a
                href="mailto:hello@policyscanner.co.uk"
                className="underline decoration-dotted underline-offset-2 hover:text-foreground"
              >
                hello@policyscanner.co.uk
              </a>
              .
            </p>
          </Section>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-8 text-xs text-muted">
          © {new Date().getFullYear()} PolicyScanner ·{" "}
          <a href="/" className="hover:underline">
            Home
          </a>
        </div>
      </footer>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="mt-2 space-y-3 text-foreground/80">{children}</div>
    </div>
  );
}
