import { Button } from '../components/ui/Button.jsx'
import { questions } from '../interview/constants.js'

export function AiInterviewStep({
  cardClass,
  mutedText,
  headingText,
  isDark,
  previewVideoRef,
  questionIndex,
  questionDifficulty,
  questionUseCases,
  typingAnalysisByQuestion,
  aiTypingHints,
  aiTypingHintIndex,
  confidenceScore,
  attentionOnScreen,
  emotionLabel,
  transcripts,
  setTranscripts,
  answerAudioUrls,
  recording,
  recordingSeconds,
  recordingFeedback,
  isSavingAnswer,
  startAnswerRecording,
  submitAnswerRecording,
  goToNextQuestion,
  setQuestionIndex,
  resetAnswerUi,
  finishInterview,
  onMoveToCoding,
}) {
  const typingAnalysis = typingAnalysisByQuestion[questionIndex] ?? 'Analyzing response...'
  const useCase = questionUseCases[questionIndex] ?? 'Use-case: evaluate communication and reasoning.'
  const transcriptValue = transcripts[questionIndex] ?? ''
  const currentAnswerUrl = answerAudioUrls[questionIndex] ?? ''
  const fallbackFeedback = currentAnswerUrl ? 'Answer recorded. Use playback below to verify.' : 'Not recorded yet'
  const statusText = recording ? `Recording answer... ${recordingSeconds}s` : recordingFeedback || fallbackFeedback
  const startDisabled = recording || isSavingAnswer || Boolean(currentAnswerUrl)
  const totalQuestions = questions.length
  const isLastQuestion = questionIndex === totalQuestions - 1
  const difficulty = questionDifficulty[questionIndex] ?? { label: 'Medium', hint: 'General' }
  const difficultyChipClass =
    difficulty.label === 'Hard'
      ? 'border-rose-500/40 bg-rose-500/10 text-rose-200'
      : difficulty.label === 'Easy'
        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
        : 'border-amber-500/40 bg-amber-500/10 text-amber-200'

  return (
    <section className={`${cardClass} space-y-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className={`text-2xl font-semibold ${headingText}`}>AI Interview In Progress</h2>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-amber-500/15 px-3 py-1 text-amber-500">Timer: 12:48</span>
          <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-cyan-500">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className={`rounded-full border px-3 py-1 text-xs font-medium ${difficultyChipClass}`}>
            Difficulty: {difficulty.label}
          </span>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div
          className={`rounded-xl border p-4 lg:col-span-1 ${isDark ? 'border-slate-700 bg-slate-800/70' : 'border-slate-200 bg-slate-50'}`}
        >
          <p className={`text-sm ${mutedText}`}>AI Interviewer</p>
          <div
            className={`mt-3 overflow-hidden rounded-xl border ${
              isDark ? 'border-slate-700 bg-slate-950/60' : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-center gap-3 p-3">
              <div className="relative h-14 w-14">
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-violet-500 via-fuchsia-500 to-cyan-400 opacity-90 blur-[0.5px]" />
                <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                  AI
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold ${headingText}`}>HireSense</p>
                <p className={`text-xs ${mutedText}`}>Live interviewer • real-time analysis</p>
              </div>
            </div>
            <div className="px-3 pb-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800/60">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-linear-to-r from-violet-500 to-cyan-400" />
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                isDark ? 'bg-slate-950/50 text-slate-200' : 'bg-slate-100 text-slate-700'
              }`}
            >
              AI typing
            </span>
            <span className={`text-xs ${mutedText}`}>
              {aiTypingHints[aiTypingHintIndex]}
              <span className="inline-flex translate-y-px gap-1 pl-1">
                <span className="hs-typing-dot inline-block h-1 w-1 rounded-full bg-violet-400 [animation-delay:0ms]" />
                <span className="hs-typing-dot inline-block h-1 w-1 rounded-full bg-violet-400 [animation-delay:150ms]" />
                <span className="hs-typing-dot inline-block h-1 w-1 rounded-full bg-violet-400 [animation-delay:300ms]" />
              </span>
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between gap-3">
              <p className={`text-xs font-medium ${mutedText}`}>Confidence score (demo)</p>
              <p className={`text-xs font-semibold ${headingText}`}>{confidenceScore}%</p>
            </div>
            <div className={`mt-2 h-2 w-full overflow-hidden rounded-full ${isDark ? 'bg-slate-950/50' : 'bg-slate-200'}`}>
              <div
                className="h-full rounded-full bg-linear-to-r from-violet-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${confidenceScore}%` }}
              />
            </div>
            <p className={`mt-2 text-xs ${mutedText}`}>
              Heuristic signal from structure, audio presence, and focus stability (not a real model yet).
            </p>
          </div>

          <p className={`mt-3 text-sm ${mutedText}`}>{typingAnalysis}</p>
          <p className={`mt-2 text-xs ${mutedText}`}>{useCase}</p>
          <p className={`mt-2 text-xs ${mutedText}`}>
            Difficulty hint: <span className="font-medium text-slate-200">{difficulty.hint}</span>
          </p>
        </div>
        <div
          className={`rounded-xl border p-4 lg:col-span-2 ${isDark ? 'border-slate-700 bg-slate-800/70' : 'border-slate-200 bg-slate-50'}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className={`text-sm ${mutedText}`}>Candidate Preview</p>
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span
                className={`rounded-full px-2 py-1 font-medium ${
                  attentionOnScreen ? 'bg-emerald-500/10 text-emerald-300' : 'bg-orange-500/10 text-orange-200'
                }`}
              >
                Attention: {attentionOnScreen ? 'On-screen' : 'Away'}
              </span>
              <span
                className={`rounded-full px-2 py-1 font-medium ${isDark ? 'bg-slate-950/40 text-slate-200' : 'bg-slate-100 text-slate-700'}`}
              >
                Emotion (demo): {emotionLabel}
              </span>
            </div>
          </div>
          <video ref={previewVideoRef} autoPlay muted playsInline className="mt-3 h-40 w-full rounded-xl bg-slate-900 object-cover" />
          <div className="mt-3 rounded-xl bg-violet-500/10 p-3 text-sm text-violet-500">{questions[questionIndex]}</div>
          <p className={`mt-2 text-xs ${mutedText}`}>Recording Status: {statusText}</p>

          {(recording || Boolean(currentAnswerUrl)) && (
            <div className="mt-3 rounded-xl border border-slate-700/60 bg-slate-950/40 p-3">
              <p className="mb-2 text-xs text-slate-300">Voice waveform (demo)</p>
              <div className="flex h-10 items-end justify-between gap-1">
                {Array.from({ length: 28 }).map((_, idx) => (
                  <div
                    key={`wave-${questionIndex}-${idx}`}
                    className="hs-wave-bar w-1 rounded-full bg-linear-to-b from-cyan-400 to-violet-500"
                    style={{ animationDelay: `${idx * 45}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-2 rounded-lg bg-slate-900/40 p-2">
            <p className="mb-1 text-xs text-slate-300">Recorded answer playback</p>
            {currentAnswerUrl ? (
              <audio key={`${questionIndex}-${currentAnswerUrl}`} controls src={currentAnswerUrl} className="w-full" />
            ) : (
              <p className="text-xs text-slate-400">No recording for this question yet. Record an answer to enable playback.</p>
            )}
          </div>
        </div>
      </div>
      <div
        className={`rounded-xl border p-4 text-sm ${isDark ? 'border-slate-700 bg-slate-800/70 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
      >
        <label className="space-y-2">
          <span className={`text-sm font-medium ${mutedText}`}>Transcript (Optional)</span>
          <textarea
            rows={3}
            value={transcriptValue}
            onChange={(event) => {
              const next = event.target.value
              setTranscripts((prev) => {
                const copy = [...prev]
                copy[questionIndex] = next
                return copy
              })
            }}
            placeholder="Type a short transcript / notes for this answer..."
            className={`w-full resize-none rounded-xl border px-3 py-2 outline-none transition ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100 focus:border-violet-500' : 'border-slate-300 bg-white text-slate-900 focus:border-violet-500'}`}
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Button variant="success" disabled={startDisabled} onClick={startAnswerRecording}>
          Start Answer
        </Button>
        <Button variant="info" disabled={!recording} onClick={submitAnswerRecording}>
          Submit Answer
        </Button>
        <Button
          variant="primary"
          disabled={recording || isSavingAnswer || !currentAnswerUrl || isLastQuestion}
          onClick={goToNextQuestion}
        >
          Next Question
        </Button>
        <Button
          variant="warning"
          disabled={isLastQuestion}
          onClick={() =>
            setQuestionIndex((prev) => {
              const next = prev < totalQuestions - 1 ? prev + 1 : prev
              if (next !== prev) resetAnswerUi()
              return next
            })
          }
        >
          Skip Question
        </Button>
        <Button variant="danger" onClick={finishInterview}>
          End Interview
        </Button>
      </div>
      <Button variant="primary" className="w-full" onClick={onMoveToCoding}>
        Move to Coding Question
      </Button>
    </section>
  )
}
