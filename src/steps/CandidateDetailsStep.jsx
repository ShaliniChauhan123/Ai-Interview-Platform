import { Button } from '../components/ui/Button.jsx'

export function CandidateDetailsStep({
  cardClass,
  mutedText,
  headingText,
  isDark,
  candidate,
  updateCandidate,
  toggleSkill,
  roleOptions,
  experienceOptions,
  skillOptions,
  resumeFile,
  setResumeFile,
  resumeInsights,
  isCandidateFormValid,
  onBack,
  onContinue,
}) {
  const inputClass = `w-full rounded-xl border px-3 py-2 outline-none transition ${
    isDark ? 'border-slate-700 bg-slate-800 text-slate-100 focus:border-violet-500' : 'border-slate-300 bg-white text-slate-900 focus:border-violet-500'
  }`

  return (
    <section className={`${cardClass} space-y-5`}>
      <h2 className={`text-2xl font-semibold ${headingText}`}>Candidate Details</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className={`text-sm font-medium ${mutedText}`}>Full Name</span>
          <input
            type="text"
            value={candidate.fullName}
            onChange={(event) => updateCandidate('fullName', event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="space-y-2">
          <span className={`text-sm font-medium ${mutedText}`}>Email</span>
          <input
            type="email"
            value={candidate.email}
            onChange={(event) => updateCandidate('email', event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="space-y-2">
          <span className={`text-sm font-medium ${mutedText}`}>Role Applied For</span>
          <select
            value={candidate.role}
            onChange={(event) => updateCandidate('role', event.target.value)}
            className={inputClass}
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className={`text-sm font-medium ${mutedText}`}>Experience Level</span>
          <select
            value={candidate.experience}
            onChange={(event) => updateCandidate('experience', event.target.value)}
            className={inputClass}
          >
            {experienceOptions.map((experience) => (
              <option key={experience} value={experience}>
                {experience}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="space-y-2">
        <span className={`text-sm font-medium ${mutedText}`}>Skills / Technologies</span>
        <div
          className={`rounded-xl border p-3 ${isDark ? 'border-slate-700 bg-slate-800/70' : 'border-slate-300 bg-white'}`}
        >
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {skillOptions.map((skill) => {
              const selected = candidate.skills.includes(skill)
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                    selected
                      ? 'border-violet-500 bg-violet-500/10 text-violet-500'
                      : isDark
                        ? 'border-slate-700 bg-slate-900 text-slate-200 hover:border-violet-500'
                        : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-violet-500'
                  }`}
                >
                  {skill}
                </button>
              )
            })}
          </div>
          <p className={`mt-3 text-xs ${mutedText}`}>
            Selected: {candidate.skills.length ? candidate.skills.join(', ') : 'None'}
          </p>
        </div>
      </div>
      <div
        className={`rounded-xl border border-dashed p-4 text-sm ${isDark ? 'border-slate-600 bg-slate-800/60 text-slate-300' : 'border-slate-300 bg-slate-50 text-slate-600'}`}
      >
        <label className="cursor-pointer">
          <span className="mb-2 block font-medium">Upload Resume (Optional)</span>
          <span className="block">Click to browse PDF/DOC/DOCX files.</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
          />
        </label>
        {resumeFile ? (
          <p className="mt-2 text-emerald-500">Selected: {resumeFile.name}</p>
        ) : (
          <p className="mt-2">No file selected yet.</p>
        )}
      </div>

      <div className={`rounded-xl border p-4 ${isDark ? 'border-slate-700 bg-slate-950/35' : 'border-slate-200 bg-white'}`}>
        <p className={`text-sm font-semibold ${headingText}`}>Resume analysis (demo)</p>
        <ul className={`mt-3 space-y-2 text-sm ${mutedText}`}>
          {resumeInsights.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-violet-500" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="ghost" className={isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'} onClick={onBack}>
          Back
        </Button>
        <Button variant="primary" disabled={!isCandidateFormValid} onClick={onContinue}>
          Continue
        </Button>
      </div>
    </section>
  )
}
