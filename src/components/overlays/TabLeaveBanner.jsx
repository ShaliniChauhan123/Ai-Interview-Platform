export function TabLeaveBanner({ isDark, message, tabAwayEvents, onDismiss }) {
  if (!message) return null

  return (
    <div
      className={`w-full max-w-full rounded-2xl border p-3 shadow-lg sm:p-4 ${
        isDark
          ? 'border-orange-500/45 bg-orange-950/85 text-orange-50 backdrop-blur-md supports-[backdrop-filter]:bg-orange-950/70'
          : 'border-orange-400/70 bg-orange-50/95 text-orange-950 backdrop-blur-sm supports-[backdrop-filter]:bg-orange-50/90'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-semibold leading-snug ${isDark ? 'text-orange-100' : 'text-orange-900'}`}>
            Interview focus warning
          </p>
          <p
            className={`mt-1.5 text-sm leading-relaxed ${isDark ? 'text-orange-50/95' : 'text-orange-950/90'}`}
          >
            {message}
          </p>
          <p className={`mt-2 text-xs leading-snug ${isDark ? 'text-orange-100/75' : 'text-orange-900/75'}`}>
            Tab-away events recorded: {tabAwayEvents}
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className={`w-full shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium sm:w-auto sm:py-2 ${
            isDark
              ? 'bg-orange-950/40 text-orange-50 ring-1 ring-orange-500/30 hover:bg-orange-950/55'
              : 'bg-white text-orange-950 ring-1 ring-orange-300/60 hover:bg-orange-100'
          }`}
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
