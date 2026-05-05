import { Button } from '../components/ui/Button.jsx'

export function WelcomeStep({ cardClass, mutedText, headingText, isDark, onContinue }) {
  return (
    <section className={`${cardClass} space-y-6`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className={`text-sm ${mutedText}`}>AI Interview Platform</p>
          <h1 className={`text-3xl font-semibold tracking-tight sm:text-4xl ${headingText}`}>HireSense AI</h1>
        </div>
        <span className="inline-flex w-fit rounded-full bg-violet-500/15 px-3 py-1 text-xs font-medium text-violet-500">
          Estimated Duration: 35 minutes
        </span>
      </div>

      <p className={`${mutedText} max-w-3xl leading-relaxed`}>
        Welcome to your structured AI interview. You will answer behavioral and technical questions, complete one coding challenge,
        and receive a post-interview summary.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          'Keep your camera on and audio clear.',
          'Answer each question before moving forward.',
          'Use the coding section for implementation tasks.',
          'Stay on this tab during the interview; leaving triggers a focus warning.',
        ].map((rule) => (
          <div
            key={rule}
            className={`rounded-xl border p-3 text-sm leading-relaxed ${
              isDark ? 'border-slate-700 bg-slate-800/70' : 'border-slate-200 bg-slate-50'
            }`}
          >
            {rule}
          </div>
        ))}
      </div>

      <Button variant="primary" size="lg" className="w-full" onClick={onContinue}>
        Start Interview
      </Button>
    </section>
  )
}
