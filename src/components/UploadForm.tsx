"use client";

import { useState } from "react";
import type { Parsed, UploadResponse } from "@/lib/types";
import { ResultsView } from "./ResultsView";
import { Recommendations } from "./Recommendations";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Parsed | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: form,
      });
      const data = (await res.json()) as UploadResponse;

      if (!res.ok || !data.success) {
        setError(data.error || "Upload failed");
        return;
      }

      if (data.parsed?.error) {
        setError(`Parser issue: ${data.parsed.error}`);
        return;
      }

      setResult(data.parsed ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  }

  return (
    <div className="w-full max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`block cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${
            dragOver
              ? "border-brand bg-brand/5"
              : "border-border bg-card hover:border-brand/60"
          }`}
        >
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
            className="sr-only"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <div className="text-base font-medium">
            {file ? file.name : "Drop your insurance document here"}
          </div>
          <div className="mt-1 text-sm text-muted">
            {file
              ? `${(file.size / 1024).toFixed(0)} KB · click to choose another`
              : "or click to browse · PDF, PNG, JPG, WEBP, TXT"}
          </div>
        </label>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted">
            Files stay on the server only long enough to extract text. Nothing
            is stored.
          </p>
          <button
            type="submit"
            disabled={!file || loading}
            className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Scanning…" : "Scan policy"}
          </button>
        </div>
      </form>

      {error ? (
        <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">
            Results
          </h2>
          <ResultsView data={result} />
          <Recommendations data={result} />
        </div>
      ) : null}
    </div>
  );
}
