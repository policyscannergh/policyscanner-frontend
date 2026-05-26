"use client";

import { useEffect, useState } from "react";

const WORDS = ["cover,", "exclusions,", "excesses,", "fine print,"];
const ROTATE_MS = 2500;

export function CyclingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-grid whitespace-nowrap align-baseline">
      {WORDS.map((word, i) => (
        <span
          key={word}
          aria-hidden={i !== index}
          className={`col-start-1 row-start-1 text-brand transition-all duration-500 ease-out ${
            i === index
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0"
          }`}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
