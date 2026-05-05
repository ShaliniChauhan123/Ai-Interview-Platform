export function formatDurationFromMs(totalMs) {
  const safeMs = Math.max(0, Math.floor(totalMs))
  const totalSeconds = Math.floor(safeMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
}

export function countBehavioralAttempts(answerUrls, transcriptRows) {
  let count = 0
  for (let i = 0; i < answerUrls.length; i += 1) {
    const hasAudio = Boolean(answerUrls[i])
    const hasTranscript = Boolean((transcriptRows[i] ?? '').trim())
    if (hasAudio || hasTranscript) count += 1
  }
  return count
}
