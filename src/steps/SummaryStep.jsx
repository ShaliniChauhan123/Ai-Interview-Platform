import { Button } from '../components/ui/Button.jsx'

export function SummaryStep({
  cardClass,
  mutedText,
  headingText,
  isDark,
  attempted,
  totalQuestions,
  displayName,
  timeTaken,
  onRestart,
}) {
  return (
    <section className={`${cardClass} space-y-6`}>
      <h2 className={`text-2xl font-semibold ${headingText}`}>Interview Summary</h2>

      <div className={`space-y-3 text-sm ${mutedText}`}>
        <p>
          <span className={`font-medium ${headingText}`}>Candidate name</span>
          <br />
          {displayName}
        </p>

        <p>
          <span className={`font-medium ${headingText}`}>Interview status</span>
          <br />● Interview completed
        </p>

        <p>
          <span className={`font-medium ${headingText}`}>Total questions attempted</span>
          <br />● {attempted}/{totalQuestions}
        </p>

        <p>
          <span className={`font-medium ${headingText}`}>Time taken</span>
          <br />● {timeTaken}
        </p>

        <div className="space-y-2">
          <p className={`font-medium ${headingText}`}>AI evaluation placeholder</p>
          <p>
            ● Demonstrated strong problem-solving and communication. Focus on delivering more concise final answers under time
            pressure.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className={`rounded-xl p-4 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
            <p className={`font-medium ${headingText}`}>Strengths</p>
            <p className="mt-2">● Clarity, structured thinking, debugging depth</p>
          </div>
          <div className={`rounded-xl p-4 ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
            <p className={`font-medium ${headingText}`}>Improvement areas</p>
            <p className="mt-2">● Conciseness, edge-case explanation</p>
          </div>
        </div>

        <p>
          <span className={`font-medium ${headingText}`}>Final status</span>
          <br />● Submitted for Review
        </p>
      </div>

      <div className={`rounded-xl border p-4 ${isDark ? 'border-slate-700 bg-slate-950/35' : 'border-slate-200 bg-white'}`}>
        <p className={`text-sm font-semibold ${headingText}`}>Interview feedback dashboard (demo)</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Communication', `${Math.min(95, 72 + Math.round((attempted / Math.max(1, totalQuestions)) * 18))}%`],
            ['Structure', `${Math.min(92, 66 + Math.round((attempted / Math.max(1, totalQuestions)) * 16))}%`],
            ['Technical depth', `${Math.min(90, 64 + Math.round((attempted / Math.max(1, totalQuestions)) * 14))}%`],
            ['Consistency', `${Math.min(93, 70 + Math.round((attempted / Math.max(1, totalQuestions)) * 12))}%`],
          ].map(([label, score]) => (
            <div
              key={label}
              className={`rounded-lg border p-3 ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50'}`}
            >
              <p className={`text-xs ${mutedText}`}>{label}</p>
              <p className={`mt-2 text-lg font-semibold ${headingText}`}>{score}</p>
              <div className={`mt-2 h-2 w-full overflow-hidden rounded-full ${isDark ? 'bg-slate-950/50' : 'bg-slate-200'}`}>
                <div
                  className="h-full rounded-full bg-linear-to-r from-violet-500 to-cyan-400 transition-all duration-500"
                  style={{ width: score }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className={`mt-3 text-xs ${mutedText}`}>
          This dashboard is a UI scaffold (not real scoring). Wire it to your evaluation service when ready.
        </p>
      </div>

      <Button variant="primary" size="lg" className="w-full" onClick={onRestart}>
        Start Interview Again
      </Button>
    </section>
  )
}
