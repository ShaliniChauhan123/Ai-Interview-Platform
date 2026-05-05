import { Button } from '../components/ui/Button.jsx'

export function CodingStep({
  cardClass,
  mutedText,
  headingText,
  isDark,
  language,
  setLanguage,
  codeByLanguage,
  setCodeByLanguage,
  codingPrompt,
  runMessage,
  setRunMessage,
  finishInterview,
}) {
  return (
    <section className={`${cardClass} space-y-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className={`text-2xl font-semibold ${headingText}`}>Technical Coding Round</h2>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            Difficulty: Medium
          </span>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className={`rounded-xl border px-3 py-2 text-sm ${isDark ? 'border-slate-700 bg-slate-800 text-slate-100' : 'border-slate-300 bg-white text-slate-800'}`}
          >
            <option>JavaScript</option>
            <option>TypeScript</option>
            <option>Python</option>
            <option>Java</option>
          </select>
        </div>
      </div>
      <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/70' : 'bg-slate-50'}`}>
        <h3 className={`text-lg font-semibold ${headingText}`}>{codingPrompt.title}</h3>
        <p className={`mt-2 text-sm ${mutedText}`}>{codingPrompt.statement}</p>
        <p className={`mt-3 text-sm ${mutedText}`}>Input: {codingPrompt.input}</p>
        <p className={`text-sm ${mutedText}`}>Output: {codingPrompt.output}</p>
      </div>
      <div
        className={`rounded-xl border p-4 ${isDark ? 'border-slate-700 bg-slate-950 text-slate-200' : 'border-slate-300 bg-slate-900 text-slate-100'}`}
      >
        <p className="mb-2 text-xs text-emerald-400">{language} editor</p>
        <textarea
          value={codeByLanguage[language] ?? ''}
          onChange={(event) => {
            const next = event.target.value
            setCodeByLanguage((prev) => ({ ...prev, [language]: next }))
          }}
          spellCheck={false}
          rows={14}
          aria-label={`${language} code editor`}
          className={`min-h-[220px] w-full resize-y rounded-lg border px-3 py-2 font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-emerald-500/40 ${
            isDark ? 'border-slate-700 bg-slate-950 text-slate-100' : 'border-slate-600 bg-slate-950 text-slate-100'
          }`}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="info" onClick={() => setRunMessage('Code executed successfully. 3/3 test cases passed.')}>
          Run Code
        </Button>
        <Button variant="primary" onClick={finishInterview}>
          Submit Code
        </Button>
      </div>
      {runMessage && <p className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-500">{runMessage}</p>}
    </section>
  )
}
