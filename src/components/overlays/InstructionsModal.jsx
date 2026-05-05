export function InstructionsModal({ isDark, mutedText, headingText, onClose, onToggleTheme }) {
  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Interview instructions"
    >
      <div
        className={`w-full max-w-2xl rounded-2xl border p-6 shadow-2xl ${
          isDark ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-900'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`text-sm ${mutedText}`}>Interview instructions</p>
            <h3 className={`mt-1 text-2xl font-semibold ${headingText}`}>Before you begin</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-700'}`}
          >
            Close
          </button>
        </div>

        <ul className={`mt-5 space-y-3 text-sm ${mutedText}`}>
          <li>● Keep your camera on and audio clear for the entire interview.</li>
          <li>● Answer each question fully before moving on (recording is per-question).</li>
          <li>● Avoid switching tabs during active interview time (you’ll get a warning).</li>
          <li>● Use the coding section for implementation tasks; submit ends the session.</li>
          <li>● Auto-save runs in the background for transcripts, code, and session metadata.</li>
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500"
          >
            Got it
          </button>
          <button
            type="button"
            onClick={() => {
              onClose()
              onToggleTheme()
            }}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-700'}`}
          >
            Toggle theme
          </button>
        </div>
      </div>
    </div>
  )
}
