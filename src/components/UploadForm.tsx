"use client";

import { useState } from "react";
import type { Parsed, UploadResponse } from "@/lib/types";
import { ResultsView } from "./ResultsView";
import { Recommendations } from "./Recommendations";
import { QuoteComparison } from "./QuoteComparison";
import { ComparisonView } from "./ComparisonView";
import { RebuildCostCheck } from "./RebuildCostCheck";
import { QualityScore } from "./QualityScore";
import { RenewalCountdown } from "./RenewalCountdown";
import {
  SAMPLE_POLICY_TEXT,
  SAMPLE_ALT_POLICY_TEXT,
} from "@/lib/samplePolicy";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Slot = "A" | "B";

interface ParseState {
  file: File | null;
  loading: boolean;
  error: string | null;
  result: Parsed | null;
}

const empty: ParseState = {
  file: null,
  loading: false,
  error: null,
  result: null,
};

export function UploadForm() {
  const [a, setA] = useState<ParseState>(empty);
  const [b, setB] = useState<ParseState>(empty);
  const [compareMode, setCompareMode] = useState(false);

  const set = (slot: Slot, updater: (prev: ParseState) => ParseState) => {
    if (slot === "A") setA(updater);
    else setB(updater);
  };

  async function submitFile(slot: Slot, file: File) {
    set(slot, (prev) => ({
      ...prev,
      file,
      loading: true,
      error: null,
      result: null,
    }));

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: form,
      });
      const data = (await res.json()) as UploadResponse;

      if (!res.ok || !data.success) {
        set(slot, (prev) => ({
          ...prev,
          loading: false,
          error: data.error || "Upload failed",
        }));
        return;
      }
      if (data.parsed?.error) {
        set(slot, (prev) => ({
          ...prev,
          loading: false,
          error: `Parser issue: ${data.parsed?.error}`,
        }));
        return;
      }
      set(slot, (prev) => ({
        ...prev,
        loading: false,
        result: data.parsed ?? null,
      }));
    } catch (err) {
      set(slot, (prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Network error",
      }));
    }
  }

  function makeSampleFile(text: string, name: string): File {
    return new File([text], name, { type: "text/plain" });
  }

  function loadSample(slot: Slot) {
    const text = slot === "A" ? SAMPLE_POLICY_TEXT : SAMPLE_ALT_POLICY_TEXT;
    const name =
      slot === "A" ? "sample_aviva_renewal.txt" : "sample_lv_quote.txt";
    submitFile(slot, makeSampleFile(text, name));
  }

  function reset() {
    setA(empty);
    setB(empty);
    setCompareMode(false);
  }

  const showComparison =
    compareMode && a.result && b.result ? true : false;

  return (
    <div className="w-full max-w-3xl">
      <UploadPanel
        state={a}
        slot="A"
        onFile={(file) => submitFile("A", file)}
        onSample={() => loadSample("A")}
        showSampleButton={!a.result && !a.loading}
      />

      {a.error ? (
        <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-400">
          {a.error}
        </div>
      ) : null}

      {a.result && !compareMode ? (
        <div className="mt-10">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="text-2xl font-semibold tracking-tight">Results</h2>
            <button
              type="button"
              onClick={() => setCompareMode(true)}
              className="inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-2 text-xs font-medium transition hover:border-brand/40 hover:bg-brand/5"
            >
              Compare with another policy →
            </button>
          </div>
          <QualityScore data={a.result} />
          <RenewalCountdown data={a.result} />
          <ResultsView data={a.result} />
          <RebuildCostCheck data={a.result} />
          <QuoteComparison data={a.result} />
          <Recommendations data={a.result} />
        </div>
      ) : null}

      {compareMode ? (
        <div className="mt-10">
          {!showComparison ? (
            <>
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Add a second policy
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    Upload a quote or renewal to compare against your first
                    document.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCompareMode(false);
                    setB(empty);
                  }}
                  className="text-xs text-muted underline decoration-dotted underline-offset-4 hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
              {a.result ? (
                <div className="mb-5 rounded-2xl border border-border bg-card px-4 py-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[10px] font-medium uppercase tracking-wider text-muted">
                        Policy A · already scanned
                      </div>
                      <div className="mt-0.5 truncate font-semibold">
                        {a.result.policy?.insurer ||
                          a.result.policy?.brand ||
                          "Policy"}
                        {a.result.policy?.annual_premium_gbp
                          ? ` · £${a.result.policy.annual_premium_gbp.toLocaleString()}/yr`
                          : ""}
                      </div>
                    </div>
                    <span
                      aria-hidden
                      className="shrink-0 text-emerald-600 dark:text-emerald-500"
                    >
                      ✓
                    </span>
                  </div>
                </div>
              ) : null}
              <UploadPanel
                state={b}
                slot="B"
                onFile={(file) => submitFile("B", file)}
                onSample={() => loadSample("B")}
                showSampleButton={!b.result && !b.loading}
                sampleLabel="Try with a sample alternative quote"
              />
              {b.error ? (
                <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-400">
                  {b.error}
                </div>
              ) : null}
            </>
          ) : (
            <>
              <ComparisonView
                a={a.result as Parsed}
                b={b.result as Parsed}
                onReset={reset}
              />
              <Recommendations data={b.result as Parsed} />
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

function UploadPanel({
  state,
  slot,
  onFile,
  onSample,
  showSampleButton,
  sampleLabel = "Try with a sample policy",
}: {
  state: ParseState;
  slot: Slot;
  onFile: (file: File) => void;
  onSample: () => void;
  showSampleButton: boolean;
  sampleLabel?: string;
}) {
  const [dragOver, setDragOver] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onFile(dropped);
  }

  return (
    <div className="space-y-4">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`block cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition sm:p-10 ${
          dragOver
            ? "border-brand bg-brand/5"
            : "border-border bg-card hover:border-brand/60"
        }`}
      >
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
        <div className="text-base font-medium">
          {state.file
            ? state.file.name
            : slot === "B"
              ? "Drop the second document here"
              : "Drop your insurance document here"}
        </div>
        <div className="mt-1 text-sm text-muted">
          {state.file
            ? `${(state.file.size / 1024).toFixed(0)} KB · click to choose another`
            : "or click to browse · PDF, PNG, JPG, WEBP, TXT"}
        </div>
      </label>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          Files stay on the server only long enough to extract text. Nothing
          is stored.
        </p>
        {state.loading ? (
          <span className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground">
            <Spinner /> Scanning…
          </span>
        ) : showSampleButton ? (
          <button
            type="button"
            onClick={onSample}
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-medium transition hover:border-brand/40 hover:bg-brand/5"
          >
            {sampleLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
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
