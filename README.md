# AI Interview Platform

A React + Vite demo for a structured AI-style interview flow: welcome and candidate details, device setup with camera preview, behavioral questions with per-question audio recording, a coding round, and a completion summary with feedback placeholders.

Built with **React 19**, **Vite 8**, and **Tailwind CSS v4**.

## Project notes (short)

### Tech stack

- **UI:** React 19, JSX, client-side state in `App.jsx`
- **Build:** Vite 8, `@vitejs/plugin-react`
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Quality:** ESLint 10 with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`

### Features implemented

Core flow: welcome → candidate details (skills, optional resume upload) → device setup with live camera preview → behavioral interview → coding round → summary with restart.

**Product / UX (as shipped)**

- **Dark mode / light mode** — Toggle in the interview header; theme applies across steps and modals.
- **Question difficulty indicator** — Per-question difficulty label and hint chip during the AI interview step.
- **AI typing animation** — Rotating interviewer hints plus animated typing dots while the interview step is active.
- **Confidence score UI** — Demo heuristic bar and percentage during the interview (not a trained model).
- **Voice waveform** — Live frequency-band bars from the microphone via Web Audio (`AnalyserNode`) while recording, plus a rough Hz estimate from the spectrum; collapses to idle after submit.
- **Resume analysis section** — On the candidate step: optional file pick, demo “analysis” bullet list driven by filename and selected skills (no parsing service).
- **Interview instructions modal** — Opens from the header during the flow; dismissible with rules and theme toggle shortcut.
- **Auto-save status** — Header shows a “Saved” autosave line with a timestamp that updates on an interval and when answers, transcripts, code, or step change.
- **Warning when focus leaves the interview** — If the **page/tab is hidden** during interview or coding (Page Visibility API), a dismissible **orange** in-flow banner appears and a tab-away **event count** increments (not the same as camera “leaving the frame”).
- **Candidate emotion / attention UI** — Chips for **Attention** (on-screen vs away, from visibility) and **Emotion** (demo label) on the in-step preview and on the floating bottom preview.
- **Interview feedback dashboard** — On the summary step: demo metric cards and strengths / improvement panels (scaffold only, not real scoring).
- **Mobile-responsive layout** — Responsive grids, stacked controls where needed, safe-area spacing on the floating preview, full-width tab warning on small screens, minimizable floating candidate preview.
- **Smooth animations and transitions** — e.g. progress bar, card/theme transitions, typing-dot keyframes, waveform bar height transitions, floating preview width transition.

**Also in the app (not in the checklist above)**

- Per-question **audio record / submit / playback** (WebM), **optional transcript**, **coding** editor with per-language drafts and mock “run code,” **tab-leave hook** + **`TabLeaveBanner`**, **floating PIP** with **minimize/expand**, refactored **steps/components/hooks**.

### Assumptions

- Runs in a **modern desktop browser** with `navigator.mediaDevices.getUserMedia` and `MediaRecorder` (behavior varies by browser; WebM is assumed for recordings)
- **No backend:** all state is in-memory in the browser; refresh loses session data
- **Resume “analysis,” scores, emotion, and attention** are UI placeholders or simple heuristics, not ML or proctoring-grade detection
- **Single candidate, single session** — no auth, roles, or persistence

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

| Command                            | Description                        |
| ---------------------------------- | ---------------------------------- |
| `npm run dev` / `pnpm dev`         | Start dev server with HMR          |
| `npm run build` / `pnpm build`     | Production build to `dist/`        |
| `npm run preview` / `pnpm preview` | Serve the production build locally |
| `npm run lint` / `pnpm lint`       | Run ESLint                         |

## Project layout (high level)

- `src/App.jsx` — flow state, media/recording, and step orchestration
- `src/steps/` — UI for each wizard step
- `src/components/` — shared layout, overlays, and UI primitives
- `src/interview/` — copy, question data, and small helpers
- `src/hooks/` — autosave heartbeat, tab-visibility guard, live recording waveform (`AnalyserNode`)

## Lockfiles

- **Commit the lockfile** for whichever tool your team and CI use: `package-lock.json` for npm, `pnpm-lock.yaml` for pnpm, or `yarn.lock` for Yarn.
- **Avoid committing two different lockfiles** for the same repo unless you intentionally support both (they can drift and confuse installs).
- **If you standardize on pnpm:** commit `pnpm-lock.yaml` and remove `package-lock.json` (or stop updating it) so there is a single source of truth.
- **If you stay on npm:** keep `package-lock.json` and you can omit or delete `pnpm-lock.yaml` unless you switch the project to pnpm.

## License

Private / internal — adjust as needed.
