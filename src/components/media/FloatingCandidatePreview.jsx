import { useState } from 'react'

export function FloatingCandidatePreview({
  isDark,
  mutedText,
  floatingVideoRef,
  attentionOnScreen,
  emotionLabel,
}) {
  const [minimized, setMinimized] = useState(false)

  return (
    <div
      className={`fixed z-50 overflow-hidden rounded-2xl border shadow-lg transition-[width] duration-200 ease-out bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] right-[max(1.25rem,env(safe-area-inset-right,0px))] ${
        minimized
          ? `w-[min(calc(100vw-1.5rem),18rem)] ${isDark ? 'border-slate-700 bg-slate-900/95' : 'border-slate-200 bg-white/95'}`
          : `w-[min(100vw-2rem,16rem)] ${isDark ? 'border-slate-700 bg-slate-900/80' : 'border-slate-200 bg-white/90'}`
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <p className={`min-w-0 truncate text-xs font-medium ${mutedText}`}>Candidate preview</p>
        <div className="flex shrink-0 items-center gap-1.5">
          {!minimized && (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </span>
          )}
          <button
            type="button"
            onClick={() => setMinimized((v) => !v)}
            aria-expanded={!minimized}
            aria-label={minimized ? 'Expand candidate preview' : 'Minimize candidate preview'}
            className={`rounded-lg px-2 py-1 text-[11px] font-medium transition ${
              isDark
                ? 'text-slate-200 ring-1 ring-slate-600/80 hover:bg-slate-800'
                : 'text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100'
            }`}
          >
            {minimized ? 'Expand' : 'Minimize'}
          </button>
        </div>
      </div>

      {!minimized && (
        <div className="flex flex-wrap gap-1 px-3 pb-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              attentionOnScreen ? 'bg-emerald-500/15 text-emerald-300' : 'bg-orange-500/15 text-orange-200'
            }`}
          >
            Attention: {attentionOnScreen ? 'On-screen' : 'Away'}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              isDark ? 'bg-slate-950/40 text-slate-200' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Emotion: {emotionLabel}
          </span>
        </div>
      )}

      <video
        ref={floatingVideoRef}
        autoPlay
        muted
        playsInline
        className={minimized ? 'hidden' : 'aspect-video w-full bg-slate-900 object-cover'}
        aria-hidden={minimized}
      />
    </div>
  )
}
