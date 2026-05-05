export function TabLeaveBanner({ isDark, message, tabAwayEvents, onDismiss }) {
  if (!message) return null

  return (
    <div
      className={`fixed top-4 right-4 left-4 z-55 mx-auto max-w-6xl rounded-2xl border p-4 shadow-xl sm:left-auto sm:right-4 sm:w-full ${
        isDark
          ? 'border-orange-500/45 bg-orange-500/10 text-orange-50'
          : 'border-orange-400/60 bg-orange-50 text-orange-950'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={`text-sm font-semibold ${isDark ? 'text-orange-100' : 'text-orange-900'}`}>
            Interview focus warning
          </p>
          <p className={`mt-1 text-sm ${isDark ? 'text-orange-50/90' : 'text-orange-950/90'}`}>{message}</p>
          <p className={`mt-2 text-xs ${isDark ? 'text-orange-100/70' : 'text-orange-900/70'}`}>
            Tab-away events recorded: {tabAwayEvents}
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className={`rounded-xl px-3 py-2 text-sm font-medium ${
            isDark ? 'bg-orange-950/30 text-orange-50 hover:bg-orange-950/40' : 'bg-white text-orange-950 hover:bg-orange-100'
          }`}
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
