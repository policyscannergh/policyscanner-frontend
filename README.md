# PolicyScanner — Frontend

The web app for [policyscanner.co.uk](https://policyscanner.co.uk) — upload any UK home insurance document and instantly see what you&rsquo;re actually covered for.

Built to compare on **cover**, not just price.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS v4**
- **TypeScript**
- Deployed on **Vercel**

Pairs with the [PolicyScanner backend](https://github.com/policyscannergh/policyscanner-backend) (Flask + OpenAI + OCR) which does the actual parsing.

## What&rsquo;s in here

- `src/app/page.tsx` — landing page (hero, sample-result preview, insurer trust strip, upload, how-it-works, features, FAQ, footer)
- `src/components/UploadForm.tsx` — drag-and-drop upload, POSTs to the backend, renders results
- `src/components/ResultsView.tsx` — structured cards for parsed policy data (cover, excesses, optional extras, endorsements, exclusions)
- `src/components/SampleResult.tsx` — stylised hero preview of a parsed result
- `src/components/Logo.tsx` — inline SVG brand mark
- `src/lib/types.ts` + `src/lib/format.ts` — Parsed-policy types and GBP / yes-no formatters

## Run locally

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

1. Push to GitHub.
2. Vercel → Import Project → pick this repo.
3. Add env var `NEXT_PUBLIC_API_URL` pointing at the Railway-hosted backend.
4. Vercel handles the rest.

## Why

Comparison sites optimise for price. Cover gets quietly trimmed — lower sums insured, missing accidental damage, higher excesses, sneaky exclusions. PolicyScanner pulls the cover out of your documents in plain English so you can compare like-for-like.
