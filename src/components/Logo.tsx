export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      aria-label="PolicyScanner logo"
    >
      <rect width="32" height="32" rx="8" className="fill-brand" />
      <circle
        cx="14"
        cy="14"
        r="5.5"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M18.2 18.2 L23 23"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M11.5 14 L13.5 16 L16.5 12.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
