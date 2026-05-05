import { useEffect, useState } from 'react'

export function useInterviewTabGuard({ step, interviewCompleted, setTabAwayEvents, setTabLeaveWarning }) {
  const [pageVisibility, setPageVisibility] = useState(() =>
    typeof document === 'undefined' ? 'visible' : document.visibilityState,
  )

  useEffect(() => {
    const onVisibility = () => {
      setPageVisibility(document.visibilityState)

      const hidden = document.visibilityState === 'hidden'
      if (!hidden) return

      const activeInterview = step === 3 || step === 4
      if (interviewCompleted || !activeInterview) return

      setTabAwayEvents((prev) => prev + 1)
      setTabLeaveWarning(
        'Heads up: you left the interview tab/window (page hidden). This can be flagged in a proctored session.',
      )
    }

    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [interviewCompleted, setTabAwayEvents, setTabLeaveWarning, step])

  const attentionOnScreen = pageVisibility === 'visible'

  return { pageVisibility, setPageVisibility, attentionOnScreen }
}
