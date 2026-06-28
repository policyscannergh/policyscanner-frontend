"use client";

import { useEffect, useState } from "react";
import type { Parsed } from "@/lib/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Importance = "critical" | "high" | "medium";
type Winner = "a" | "b" | "tie";

interface KeyDifference {
  importance: Importance;
  topic: string;
  impact: string;
}

interface Analysis {
  verdict: string;
  verdict_winner: Winner;
  key_differences: KeyDifference[];
}

interface CompareResponse {
  success: boolean;
  analysis?: Analysis;
  error?: string;
}

type State =
  | { kind: "loading" }
  | { kind: "ready"; analysis: Analysis }
  | { kind: "error"; message: string };

const IMPORTANCE_STYLES: Record<Importance, { dot: string; label: string }> = {
  critical: {
    dot: "bg-red-500",
    label: "text-red-700 dark:text-red-400",
  },
  high: {
    dot: "bg-amber-500",
    label: "text-amber-700 dark:text-amber-400",
  },
  medium: {
    dot: "bg-brand",
    label: "text-muted",
  },
};

const IMPORTANCE_LABEL: Record<Importance, string> = {
  critical: "Critical",
  high: "High",
  medium: "Minor",
};

export function CoverGapAnalysis({ a, b }: { a: Parsed; b: Parsed }) {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ kind: "loading" });

    fetch(`${API_URL}/compare`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ policy_a: a, policy_b: b }),
    })
      .then(async (res) => {
        const data = (await res.json()) as CompareResponse;
        if (cancelled) return;
        if (!res.ok || !data.success || !data.analysis) {
          setState({
            kind: "error",
            message: data.error || "Couldn't generate analysis",
          });
          return;
        }
        setState({ kind: "ready", analysis: data.analysis });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({
          kind: "error",
          message: err instanceof Error ? err.message : "Network error",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [a, b]);

  if (state.kind === "loading") return <Skeleton />;
  if (state.kind === "error") return <ErrorBanner message={state.message} />;

  const { analysis } = state;
  const labelA = a.policy?.insurer || a.policy?.brand || "Policy A";
  const labelB = b.policy?.insurer || b.policy?.brand || "Policy B";

  return (
    <section className="mb-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted">
          Cover gap analysis
        </div>
        <WinnerBadge winner={analysis.verdict_winner} labelA={labelA} labelB={labelB} />
      </div>

      <p className="text-pretty text-[15px] leading-snug">
        {analysis.verdict}
      </p>

      {analysis.key_differences.length > 0 ? (
        <ul className="mt-4 divide-y divide-border/60 border-t border-border/60">
          {analysis.key_differences.map((diff, i) => (
            <DifferenceRow key={i} diff={diff} />
          ))}
        </ul>
      ) : null}

      <p className="mt-3 text-[11px] text-muted">
        AI summary — check the full wording before switching.
      </p>
    </section>
  );
}

function WinnerBadge({
  winner,
  labelA,
  labelB,
}: {
  winner: Winner;
  labelA: string;
  labelB: string;
}) {
  if (winner === "tie") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-border" />
        Close call
      </span>
    );
  }
  const name = winner === "a" ? labelA : labelB;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      <span className="truncate max-w-[12rem]">{name}</span>
      <span className="text-emerald-700/70 dark:text-emerald-400/70">wins overall</span>
    </span>
  );
}

function DifferenceRow({ diff }: { diff: KeyDifference }) {
  const styles = IMPORTANCE_STYLES[diff.importance] ?? IMPORTANCE_STYLES.medium;
  return (
    <li className="flex items-start gap-3 py-3">
      <span
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${styles.dot}`}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3 className="text-sm font-semibold tracking-tight">
            {diff.topic}
          </h3>
          <span
            className={`text-[10px] font-medium uppercase tracking-wider ${styles.label}`}
          >
            · {IMPORTANCE_LABEL[diff.importance] ?? diff.importance}
          </span>
        </div>
        <p className="mt-0.5 text-sm leading-snug text-muted">
          {diff.impact}
        </p>
      </div>
    </li>
  );
}

function Skeleton() {
  return (
    <section className="mb-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted">
          Cover gap analysis
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
          <Spinner /> Reading both policies…
        </span>
      </div>
      <div className="space-y-2">
        <div className="h-3.5 w-11/12 animate-pulse rounded bg-border/60" />
        <div className="h-3.5 w-8/12 animate-pulse rounded bg-border/60" />
      </div>
      <ul className="mt-4 divide-y divide-border/60 border-t border-border/60">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="flex items-start gap-3 py-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-border/60" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="h-3 w-1/3 animate-pulse rounded bg-border/60" />
              <div className="h-3 w-11/12 animate-pulse rounded bg-border/60" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <section className="mb-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-700 dark:text-amber-400">
      Couldn&rsquo;t generate the AI summary ({message}). The side-by-side
      comparison below still works.
    </section>
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
