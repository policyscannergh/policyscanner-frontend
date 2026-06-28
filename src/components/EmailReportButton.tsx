"use client";

import { useEffect, useRef, useState } from "react";
import type { Parsed } from "@/lib/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Analysis {
  verdict: string;
  verdict_tone: "good" | "mixed" | "poor";
  observations: {
    importance: "critical" | "high" | "medium";
    topic: string;
    impact: string;
  }[];
}

type SendState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

export function EmailReportButton({
  policy,
  analysis,
}: {
  policy: Parsed;
  analysis: Analysis;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<SendState>({ kind: "idle" });
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setState({ kind: "idle" });
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state.kind === "sending") return;
    setState({ kind: "sending" });
    try {
      const res = await fetch(`${API_URL}/email-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          policy,
          analysis,
          company: honeypot,
        }),
      });
      const body = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !body.success) {
        setState({
          kind: "error",
          message: body.error || "Couldn't send the email",
        });
        return;
      }
      setState({ kind: "sent" });
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Network error",
      });
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-brand underline decoration-dotted underline-offset-4 hover:opacity-80"
      >
        <PaperIcon />
        Email me a PDF copy
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Email PDF report"
          >
            {state.kind === "sent" ? (
              <div className="text-center">
                <h3 className="text-lg font-semibold tracking-tight">
                  Report on its way
                </h3>
                <p className="mt-2 text-sm text-muted">
                  Check {email} (and your spam folder) in the next minute or
                  two. If it doesn&rsquo;t arrive, drop us a line at{" "}
                  <a
                    href="mailto:hello@policyscanner.co.uk"
                    className="underline"
                  >
                    hello@policyscanner.co.uk
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h3 className="text-lg font-semibold tracking-tight">
                  Email me the PDF
                </h3>
                <p className="mt-1.5 text-sm text-muted">
                  Get this analysis as a PDF in your inbox. No marketing —
                  we&rsquo;ll only email you back if you reply with a question.
                </p>

                <label className="mt-5 block text-xs font-medium uppercase tracking-wider text-muted">
                  Email address
                </label>
                <input
                  ref={inputRef}
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1.5 block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />

                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  name="company"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  aria-hidden
                />

                {state.kind === "error" ? (
                  <p className="mt-3 text-xs text-red-700 dark:text-red-400">
                    {state.message}
                  </p>
                ) : null}

                <div className="mt-5 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-xs text-muted hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={state.kind === "sending"}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background transition hover:opacity-90 disabled:opacity-60"
                  >
                    {state.kind === "sending" ? (
                      <>
                        <Spinner /> Sending…
                      </>
                    ) : (
                      "Send report"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

function PaperIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 2h7l3 3v9H3z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M10 2v3h3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="h-3.5 w-3.5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
