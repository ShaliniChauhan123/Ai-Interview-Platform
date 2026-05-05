export function FloatingCandidatePreview({
  isDark,
  mutedText,
  floatingVideoRef,
  attentionOnScreen,
  emotionLabel,
}) {
  return (
    <div
      className={`fixed bottom-5 right-5 z-50 w-[min(100vw-2rem,16rem)] overflow-hidden rounded-2xl border shadow-lg ${
        isDark ? 'border-slate-700 bg-slate-900/80' : 'border-slate-200 bg-white/90'
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2">
        <p className={`text-xs font-medium ${mutedText}`}>Candidate preview</p>
        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live
        </span>
      </div>
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
      <video ref={floatingVideoRef} autoPlay muted playsInline className="aspect-video w-full bg-slate-900 object-cover" />
    </div>
  )
}
