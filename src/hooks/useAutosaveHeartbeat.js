import { useEffect } from 'react'

export function useAutosaveHeartbeat(setAutoSaveAt) {
  useEffect(() => {
    const id = window.setInterval(() => {
      queueMicrotask(() => setAutoSaveAt(Date.now()))
    }, 5000)
    return () => window.clearInterval(id)
  }, [setAutoSaveAt])
}
