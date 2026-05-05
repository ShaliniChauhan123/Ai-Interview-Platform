import { Button } from '../components/ui/Button.jsx'

export function InterviewSetupStep({
  cardClass,
  mutedText,
  headingText,
  isDark,
  setupVideoRef,
  cameraStatus,
  microphoneStatus,
  internetStatus,
  setupError,
  isCheckingDevices,
  setupReady,
  getStatusColor,
  onRunDeviceChecks,
  onBack,
  onBeginInterview,
}) {
  const checks = [
    { name: 'Camera', status: cameraStatus },
    { name: 'Microphone', status: microphoneStatus },
    { name: 'Internet', status: internetStatus },
  ]

  return (
    <section className={`${cardClass} space-y-5`}>
      <h2 className={`text-2xl font-semibold ${headingText}`}>Interview Setup</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <div
          className={`rounded-xl border p-4 ${isDark ? 'border-slate-700 bg-slate-800/70' : 'border-slate-200 bg-slate-50'}`}
        >
          <p className={`mb-2 text-sm ${mutedText}`}>Live Camera Preview</p>
          <video ref={setupVideoRef} autoPlay muted playsInline className="h-48 w-full rounded-lg bg-slate-900 object-cover" />
        </div>
        <div className="space-y-3">
          <Button variant="primary" className="w-full" disabled={isCheckingDevices} onClick={onRunDeviceChecks}>
            {isCheckingDevices ? 'Checking devices...' : 'Run Camera & Microphone Check'}
          </Button>
          {setupError && <p className="rounded-xl bg-rose-500/10 p-3 text-sm text-rose-500">{setupError}</p>}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {checks.map((item) => (
          <div
            key={item.name}
            className={`rounded-xl border p-4 ${isDark ? 'border-slate-700 bg-slate-800/70' : 'border-slate-200 bg-slate-50'}`}
          >
            <p className={`text-sm ${mutedText}`}>{item.name} Check</p>
            <p className={`mt-2 font-medium ${getStatusColor(item.status)}`}>{item.status}</p>
          </div>
        ))}
      </div>
      <div
        className={`rounded-xl p-4 text-sm ${isDark ? 'bg-violet-500/10 text-slate-200' : 'bg-violet-50 text-slate-700'}`}
      >
        Guidelines: maintain eye contact, keep answers concise, and think aloud for technical questions.
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="ghost" className={isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'} onClick={onBack}>
          Back
        </Button>
        <Button variant="primary" disabled={!setupReady} onClick={onBeginInterview}>
          Begin Interview
        </Button>
      </div>
    </section>
  )
}
