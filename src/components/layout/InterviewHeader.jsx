import { STEPS } from '../../interview/constants.js'

export function InterviewHeader({
  cardClass,
  mutedText,
  headingText,
  step,
  progress,
  autoSaveLabel,
  showFlowControls,
  isDark,
  onOpenInstructions,
  onToggleTheme,
}) {
  return (
    <header className={`${cardClass} flex flex-wrap items-center justify-between gap-4`}>
      <div>
        <p className={`text-sm ${mutedText}`}>AI Interview Flow</p>
        <p className={`text-xl font-semibold ${headingText}`}>{STEPS[step]}</p>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <span className={`hidden text-xs sm:inline ${mutedText}`}>
          Auto-save: <span className="font-medium text-emerald-400">Saved</span> <span className={mutedText}>({autoSaveLabel})</span>
        </span>
        {showFlowControls && (
          <button
            type="button"
            onClick={onOpenInstructions}
            className={`rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-700'}`}
          >
            Instructions
          </button>
        )}
        <button
          type="button"
          onClick={onToggleTheme}
          className={`rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-700'}`}
        >
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <div className="w-full">
        <div className={`h-2 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <div className="h-2 rounded-full bg-violet-600 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className={`mt-2 text-xs ${mutedText}`}>
          Step {step + 1} of {STEPS.length}
        </p>
      </div>
    </header>
  )
}
