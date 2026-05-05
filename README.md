# AI Interview Platform

A React + Vite demo for a structured AI-style interview flow: welcome and candidate details, device setup with camera preview, behavioral questions with per-question audio recording, a coding round, and a completion summary with feedback placeholders.

Built with **React 19**, **Vite 8**, and **Tailwind CSS v4**.

## Requirements

- [Node.js](https://nodejs.org/) 20+ (LTS recommended)

## Install and run

Pick **one** package manager for day-to-day work and CI so lockfiles stay in sync (see [Lockfiles](#lockfiles) below).

**npm**

```bash
npm install
npm run dev
```

**pnpm**

```bash
pnpm install
pnpm dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev` / `pnpm dev`    | Start dev server with HMR |
| `npm run build` / `pnpm build` | Production build to `dist/` |
| `npm run preview` / `pnpm preview` | Serve the production build locally |
| `npm run lint` / `pnpm lint`   | Run ESLint               |

## Project layout (high level)

- `src/App.jsx` — flow state, media/recording, and step orchestration
- `src/steps/` — UI for each wizard step
- `src/components/` — shared layout, overlays, and UI primitives
- `src/interview/` — copy, question data, and small helpers
- `src/hooks/` — e.g. autosave heartbeat, tab-visibility guard

## Lockfiles

- **Commit the lockfile** for whichever tool your team and CI use: `package-lock.json` for npm, `pnpm-lock.yaml` for pnpm, or `yarn.lock` for Yarn.
- **Avoid committing two different lockfiles** for the same repo unless you intentionally support both (they can drift and confuse installs).
- **If you standardize on pnpm:** commit `pnpm-lock.yaml` and remove `package-lock.json` (or stop updating it) so there is a single source of truth.
- **If you stay on npm:** keep `package-lock.json` and you can omit or delete `pnpm-lock.yaml` unless you switch the project to pnpm.

## License

Private / internal — adjust as needed.
