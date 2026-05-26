"use client";

import { useEffect, useState } from "react";

const WORDS = ["cover,", "exclusions,", "excesses,", "fine print,"];
const ROTATE_MS = 2500;
const FADE_MS = 280;

export function CyclingWord() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase("out");
      const swap = setTimeout(() => {
        setIndex((i) => (i + 1) % WORDS.length);
        setPhase("in");
      }, FADE_MS);
      return () => clearTimeout(swap);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`inline-block text-brand transition-all duration-300 ease-out ${
        phase === "in"
          ? "translate-y-0 opacity-100"
          : "-translate-y-1 opacity-0"
      }`}
    >
      {WORDS[index]}
    </span>
  );
}
