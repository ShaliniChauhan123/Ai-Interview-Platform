import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  STEPS,
  questions,
  questionDifficulty,
  questionUseCases,
  typingAnalysisByQuestion,
  aiTypingHints,
  codingPrompt,
  defaultCodeByLanguage,
  ROLE_OPTIONS,
  EXPERIENCE_OPTIONS,
  SKILL_OPTIONS,
} from './interview/constants.js'
import { formatDurationFromMs, countBehavioralAttempts } from './interview/utils.js'
import { useAutosaveHeartbeat } from './hooks/useAutosaveHeartbeat.js'
import { useInterviewTabGuard } from './hooks/useInterviewTabGuard.js'
import { useRecordingWaveform } from './hooks/useRecordingWaveform.js'
import { TabLeaveBanner } from './components/overlays/TabLeaveBanner.jsx'
import { InstructionsModal } from './components/overlays/InstructionsModal.jsx'
import { InterviewHeader } from './components/layout/InterviewHeader.jsx'
import { FloatingCandidatePreview } from './components/media/FloatingCandidatePreview.jsx'
import { WelcomeStep } from './steps/WelcomeStep.jsx'
import { CandidateDetailsStep } from './steps/CandidateDetailsStep.jsx'
import { InterviewSetupStep } from './steps/InterviewSetupStep.jsx'
import { AiInterviewStep } from './steps/AiInterviewStep.jsx'
import { CodingStep } from './steps/CodingStep.jsx'
import { SummaryStep } from './steps/SummaryStep.jsx'

function App() {
  const [step, setStep] = useState(0)
  const [isDark, setIsDark] = useState(true)
  const [recording, setRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [recordingFeedback, setRecordingFeedback] = useState('Not recorded yet')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [transcripts, setTranscripts] = useState(() => Array(questions.length).fill(''))
  const [answerAudioUrls, setAnswerAudioUrls] = useState(() => Array(questions.length).fill(''))
  const [language, setLanguage] = useState('JavaScript')
  const [codeByLanguage, setCodeByLanguage] = useState(() => ({ ...defaultCodeByLanguage }))
  const [resumeFile, setResumeFile] = useState(null)
  const [runMessage, setRunMessage] = useState('')
  const [setupError, setSetupError] = useState('')
  const [cameraStatus, setCameraStatus] = useState('Not checked')
  const [microphoneStatus, setMicrophoneStatus] = useState('Not checked')
  const [internetStatus, setInternetStatus] = useState('Checking...')
  const [isCheckingDevices, setIsCheckingDevices] = useState(false)
  const [isSavingAnswer, setIsSavingAnswer] = useState(false)
  const [hasStream, setHasStream] = useState(false)
  const [streamTick, setStreamTick] = useState(0)
  const [interviewStartedAt, setInterviewStartedAt] = useState(null)
  const [interviewCompleted, setInterviewCompleted] = useState(false)
  const [summarySnapshot, setSummarySnapshot] = useState(null)
  const [showInstructions, setShowInstructions] = useState(false)
  const [autoSaveAt, setAutoSaveAt] = useState(() => Date.now())
  const [tabAwayEvents, setTabAwayEvents] = useState(0)
  const [tabLeaveWarning, setTabLeaveWarning] = useState('')
  const [aiTypingHintIndex, setAiTypingHintIndex] = useState(0)
  const streamRef = useRef(null)
  const runDeviceChecksRef = useRef(null)
  const answerAudioUrlsRef = useRef([])
  const mediaRecorderRef = useRef(null)
  const recordingChunksRef = useRef([])
  const recordingTimerRef = useRef(null)
  const recordingSecondsRef = useRef(0)
  const previewVideoRef = useRef(null)
  const setupVideoRef = useRef(null)
  const floatingVideoRef = useRef(null)
  const recordingAudioStreamRef = useRef(null)

  const [candidate, setCandidate] = useState({
    fullName: 'Shalini Chauhan',
    email: 'chauhanshaliniuk@gmail.com',
    role: 'Frontend Engineer',
    experience: 'Mid-Level (3-5 years)',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Testing Library'],
  })

  const { attentionOnScreen, setPageVisibility } = useInterviewTabGuard({
    step,
    interviewCompleted,
    setTabAwayEvents,
    setTabLeaveWarning,
  })
  useAutosaveHeartbeat(setAutoSaveAt)
  const { levels: waveformLevels, pitchHz: waveformPitchHz } = useRecordingWaveform(
    recording,
    recordingAudioStreamRef,
  )

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step])
  const autoSaveLabel = useMemo(() => new Date(autoSaveAt).toLocaleTimeString(), [autoSaveAt])
  const showFlowControls = !interviewCompleted && step < 5
  const isCandidateFormValid = useMemo(
    () =>
      candidate.fullName.trim() &&
      candidate.email.trim() &&
      candidate.role.trim() &&
      candidate.experience.trim() &&
      candidate.skills.length > 0,
    [candidate],
  )
  const setupReady = cameraStatus === 'Ready' && microphoneStatus === 'Ready' && navigator.onLine

  const emotionLabel = useMemo(() => {
    const moods = ['Calm', 'Focused', 'Engaged', 'Thoughtful', 'Steady']
    return moods[questionIndex % moods.length]
  }, [questionIndex])

  const confidenceScore = useMemo(() => {
    const hasAudio = Boolean(answerAudioUrls[questionIndex])
    const transcript = transcripts[questionIndex] ?? ''
    const transcriptScore = Math.min(18, Math.floor(transcript.trim().length / 40))

    const diff = questionDifficulty[questionIndex]?.label
    const difficultyBoost = diff === 'Hard' ? 6 : diff === 'Medium' ? 3 : 0

    const recordingBoost = recording ? Math.min(10, Math.floor(recordingSeconds / 6)) : 0
    const audioBoost = hasAudio ? 10 : 0

    const resumeBoost = resumeFile ? 4 : 0
    const tabPenalty = tabAwayEvents ? Math.min(14, tabAwayEvents * 4) : 0

    const raw = 58 + transcriptScore + difficultyBoost + recordingBoost + audioBoost + resumeBoost - tabPenalty
    return Math.max(40, Math.min(93, Math.round(raw)))
  }, [
    answerAudioUrls,
    questionIndex,
    recording,
    recordingSeconds,
    resumeFile,
    tabAwayEvents,
    transcripts,
  ])

  const resumeInsights = useMemo(() => {
    if (!resumeFile) {
      return [
        'Upload a resume to unlock structured parsing (skills, tenure, and role fit signals).',
        'Tip: PDFs typically produce the cleanest extraction preview.',
      ]
    }

    return [
      `Detected file: ${resumeFile.name}`,
      `Likely fit signals: ${candidate.skills.slice(0, 3).join(', ') || 'Add skills for stronger matching'}`,
      'Experience narrative looks consistent with the selected role track (demo heuristic).',
      'Suggested follow-ups: ownership examples, scale, and measurable outcomes.',
    ]
  }, [candidate.skills, resumeFile])

  const cardClass = isDark
    ? 'rounded-2xl border border-slate-700 bg-slate-900/70 p-6 transition-all duration-300'
    : 'rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300'
  const mutedText = isDark ? 'text-slate-300' : 'text-slate-600'
  const headingText = isDark ? 'text-white' : 'text-slate-900'

  const updateCandidate = (field, value) =>
    setCandidate((prev) => ({ ...prev, [field]: value }))

  const toggleSkill = (skill) => {
    setCandidate((prev) => {
      const exists = prev.skills.includes(skill)
      return {
        ...prev,
        skills: exists ? prev.skills.filter((item) => item !== skill) : [...prev.skills, skill],
      }
    })
  }

  useEffect(() => {
    const updateInternetStatus = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      const speed = connection?.downlink ? `${connection.downlink} Mbps` : null
      setInternetStatus(navigator.onLine ? `Online${speed ? ` (${speed})` : ''}` : 'Offline')
    }

    updateInternetStatus()
    window.addEventListener('online', updateInternetStatus)
    window.addEventListener('offline', updateInternetStatus)
    return () => {
      window.removeEventListener('online', updateInternetStatus)
      window.removeEventListener('offline', updateInternetStatus)
    }
  }, [])

  useEffect(() => {
    queueMicrotask(() => setAutoSaveAt(Date.now()))
  }, [answerAudioUrls, codeByLanguage, questionIndex, step, transcripts])

  useEffect(() => {
    if (step !== 3 || interviewCompleted) return

    const id = window.setInterval(() => {
      setAiTypingHintIndex((prev) => (prev + 1) % aiTypingHints.length)
    }, 2200)

    return () => window.clearInterval(id)
  }, [interviewCompleted, step])

  useEffect(() => {
    if (previewVideoRef.current && streamRef.current) {
      previewVideoRef.current.srcObject = streamRef.current
    }
    if (setupVideoRef.current && streamRef.current) {
      setupVideoRef.current.srcObject = streamRef.current
    }
    if (floatingVideoRef.current && streamRef.current) {
      floatingVideoRef.current.srcObject = streamRef.current
    }
  }, [step, streamTick])

  useEffect(() => {
    answerAudioUrlsRef.current = answerAudioUrls
  }, [answerAudioUrls])

  useEffect(
    () => () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
      ;(answerAudioUrlsRef.current ?? []).forEach((url) => {
        if (url) URL.revokeObjectURL(url)
      })
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        setHasStream(false)
      }
    },
    [],
  )

  const runDeviceChecks = useCallback(async () => {
    setSetupError('')
    setIsCheckingDevices(true)
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera or microphone API is not supported in this browser.')
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      streamRef.current = mediaStream
      setHasStream(true)
      setCameraStatus(mediaStream.getVideoTracks().length ? 'Ready' : 'Unavailable')
      setMicrophoneStatus(mediaStream.getAudioTracks().length ? 'Ready' : 'Unavailable')
      setStreamTick((prev) => prev + 1)

      if (setupVideoRef.current) {
        setupVideoRef.current.srcObject = mediaStream
      }
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Permission denied for devices.'
      setSetupError(message)
      setCameraStatus('Blocked')
      setMicrophoneStatus('Blocked')
      setHasStream(false)
    } finally {
      setIsCheckingDevices(false)
    }
  }, [])

  async function ensureCameraOn() {
    if (streamRef.current) return true
    try {
      await runDeviceChecks()
      return Boolean(streamRef.current)
    } catch {
      return false
    }
  }

  useEffect(() => {
    runDeviceChecksRef.current = runDeviceChecks
  }, [runDeviceChecks])

  useEffect(() => {
    if (step !== 3) return
    if (streamRef.current) return

    ;(async () => {
      await runDeviceChecksRef.current?.()
    })()
  }, [step])

  const getStatusColor = (status) => {
    if (status === 'Ready' || status.startsWith('Online')) return 'text-emerald-500'
    if (status === 'Not checked') return 'text-amber-500'
    return 'text-rose-500'
  }

  function stopRecordingTimer() {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = null
    }
  }

  const resetAnswerUi = () => {
    stopRecordingTimer()
    recordingChunksRef.current = []
    recordingSecondsRef.current = 0
    recordingAudioStreamRef.current = null
    setRecording(false)
    setRecordingSeconds(0)
    setRecordingFeedback('')
    setIsSavingAnswer(false)
  }

  const startAnswerRecording = async () => {
    setRecordingFeedback('')
    try {
      let mediaStream = streamRef.current
      if (!mediaStream) {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        streamRef.current = mediaStream
        setCameraStatus(mediaStream.getVideoTracks().length ? 'Ready' : 'Unavailable')
        setMicrophoneStatus(mediaStream.getAudioTracks().length ? 'Ready' : 'Unavailable')
        if (setupVideoRef.current) setupVideoRef.current.srcObject = mediaStream
        if (previewVideoRef.current) previewVideoRef.current.srcObject = mediaStream
      }

      const audioTracks = mediaStream.getAudioTracks()
      if (!audioTracks.length) {
        throw new Error('No microphone track found. Please check mic permissions.')
      }

      const audioStream = new MediaStream(audioTracks)
      recordingAudioStreamRef.current = audioStream
      const recorder = new MediaRecorder(audioStream)
      mediaRecorderRef.current = recorder
      recordingChunksRef.current = []
      setRecordingSeconds(0)
      recordingSecondsRef.current = 0
      setRecording(true)
      setIsSavingAnswer(false)
      setRecordingFeedback('Recording started. Speak now...')

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        stopRecordingTimer()
        const blob = new Blob(recordingChunksRef.current, { type: 'audio/webm' })
        if (blob.size > 0) {
          const url = URL.createObjectURL(blob)
          setAnswerAudioUrls((prev) => {
            const copy = [...prev]
            const previous = copy[questionIndex]
            if (previous) URL.revokeObjectURL(previous)
            copy[questionIndex] = url
            return copy
          })
          setRecordingFeedback(
            `Answer recorded successfully (${recordingSecondsRef.current}s). Click play below to verify.`,
          )
          queueMicrotask(() => setIsSavingAnswer(false))
        } else {
          setRecordingFeedback('No audio captured. Please try recording again.')
          setIsSavingAnswer(false)
        }
      }

      recorder.start()
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          const next = prev + 1
          recordingSecondsRef.current = next
          return next
        })
      }, 1000)
    } catch (error) {
      recordingAudioStreamRef.current = null
      setRecording(false)
      stopRecordingTimer()
      setRecordingFeedback(error instanceof Error ? error.message : 'Could not start recording.')
    }
  }

  const submitAnswerRecording = () => {
    const recorder = mediaRecorderRef.current
    if (!recording || !recorder) {
      setRecordingFeedback('Start recording first, then submit your answer.')
      return
    }
    setRecording(false)
    setIsSavingAnswer(true)
    setRecordingFeedback('Saving your answer…')
    recorder.stop()
  }

  const goToNextQuestion = () => {
    if (!(answerAudioUrls[questionIndex] ?? '')) {
      setRecordingFeedback('Record an answer (and submit) first, then continue.')
      return
    }
    resetAnswerUi()
    setQuestionIndex((prev) => (prev < questions.length - 1 ? prev + 1 : prev))
  }

  function stopInterviewMedia() {
    stopRecordingTimer()
    setRecording(false)
    setIsSavingAnswer(false)

    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      try {
        recorder.onstop = null
        recorder.stop()
      } catch {
        // ignore
      }
    }
    mediaRecorderRef.current = null
    recordingAudioStreamRef.current = null

    if (previewVideoRef.current) previewVideoRef.current.srcObject = null
    if (setupVideoRef.current) setupVideoRef.current.srcObject = null
    if (floatingVideoRef.current) floatingVideoRef.current.srcObject = null

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setHasStream(false)
    setStreamTick((prev) => prev + 1)
  }

  function finishInterview() {
    const completedAt = Date.now()
    const startedAt = interviewStartedAt ?? completedAt
    const attempted = countBehavioralAttempts(answerAudioUrls, transcripts)
    const totalQuestions = questions.length
    const timeTaken = formatDurationFromMs(completedAt - startedAt)

    setSummarySnapshot({
      candidateName: candidate.fullName,
      attempted,
      totalQuestions,
      timeTaken,
    })

    setInterviewCompleted(true)

    answerAudioUrls.forEach((url) => {
      if (url) URL.revokeObjectURL(url)
    })
    setAnswerAudioUrls(() => Array(questions.length).fill(''))

    stopInterviewMedia()

    setTabLeaveWarning('')
    setTabAwayEvents(0)
    setPageVisibility(typeof document === 'undefined' ? 'visible' : document.visibilityState)

    setStep(5)
  }

  function restartInterview() {
    answerAudioUrls.forEach((url) => {
      if (url) URL.revokeObjectURL(url)
    })

    stopInterviewMedia()

    setInterviewCompleted(false)
    setSummarySnapshot(null)
    setInterviewStartedAt(null)

    setQuestionIndex(0)
    setTranscripts(() => Array(questions.length).fill(''))
    setAnswerAudioUrls(() => Array(questions.length).fill(''))
    setRecordingFeedback('Not recorded yet')
    setRecordingSeconds(0)
    recordingSecondsRef.current = 0

    setLanguage('JavaScript')
    setCodeByLanguage({ ...defaultCodeByLanguage })
    setRunMessage('')

    setCameraStatus('Not checked')
    setMicrophoneStatus('Not checked')
    setSetupError('')

    setShowInstructions(false)
    setTabAwayEvents(0)
    setTabLeaveWarning('')
    setPageVisibility(typeof document === 'undefined' ? 'visible' : document.visibilityState)
    setAiTypingHintIndex(0)

    setStep(0)
  }

  const renderStep = () => {
    if (interviewCompleted || step === 5) {
      const attempted = summarySnapshot?.attempted ?? 0
      const totalQuestions = summarySnapshot?.totalQuestions ?? questions.length
      const displayName = summarySnapshot?.candidateName ?? candidate.fullName
      const timeTaken = summarySnapshot?.timeTaken ?? '0s'

      return (
        <SummaryStep
          cardClass={cardClass}
          mutedText={mutedText}
          headingText={headingText}
          isDark={isDark}
          attempted={attempted}
          totalQuestions={totalQuestions}
          displayName={displayName}
          timeTaken={timeTaken}
          onRestart={restartInterview}
        />
      )
    }

    if (step === 0) {
      return (
        <WelcomeStep
          cardClass={cardClass}
          mutedText={mutedText}
          headingText={headingText}
          isDark={isDark}
          onContinue={() => setStep(1)}
        />
      )
    }

    if (step === 1) {
      return (
        <CandidateDetailsStep
          cardClass={cardClass}
          mutedText={mutedText}
          headingText={headingText}
          isDark={isDark}
          candidate={candidate}
          updateCandidate={updateCandidate}
          toggleSkill={toggleSkill}
          roleOptions={ROLE_OPTIONS}
          experienceOptions={EXPERIENCE_OPTIONS}
          skillOptions={SKILL_OPTIONS}
          resumeFile={resumeFile}
          setResumeFile={setResumeFile}
          resumeInsights={resumeInsights}
          isCandidateFormValid={isCandidateFormValid}
          onBack={() => setStep(0)}
          onContinue={() => setStep(2)}
        />
      )
    }

    if (step === 2) {
      return (
        <InterviewSetupStep
          cardClass={cardClass}
          mutedText={mutedText}
          headingText={headingText}
          isDark={isDark}
          setupVideoRef={setupVideoRef}
          cameraStatus={cameraStatus}
          microphoneStatus={microphoneStatus}
          internetStatus={internetStatus}
          setupError={setupError}
          isCheckingDevices={isCheckingDevices}
          setupReady={setupReady}
          getStatusColor={getStatusColor}
          onRunDeviceChecks={runDeviceChecks}
          onBack={() => setStep(1)}
          onBeginInterview={async () => {
            const ok = await ensureCameraOn()
            if (!ok) return
            setInterviewStartedAt((prev) => prev ?? Date.now())
            setStep(3)
          }}
        />
      )
    }

    if (step === 3) {
      return (
        <AiInterviewStep
          cardClass={cardClass}
          mutedText={mutedText}
          headingText={headingText}
          isDark={isDark}
          previewVideoRef={previewVideoRef}
          questionIndex={questionIndex}
          questionDifficulty={questionDifficulty}
          questionUseCases={questionUseCases}
          typingAnalysisByQuestion={typingAnalysisByQuestion}
          aiTypingHints={aiTypingHints}
          aiTypingHintIndex={aiTypingHintIndex}
          confidenceScore={confidenceScore}
          attentionOnScreen={attentionOnScreen}
          emotionLabel={emotionLabel}
          transcripts={transcripts}
          setTranscripts={setTranscripts}
          answerAudioUrls={answerAudioUrls}
          recording={recording}
          recordingSeconds={recordingSeconds}
          recordingFeedback={recordingFeedback}
          isSavingAnswer={isSavingAnswer}
          startAnswerRecording={startAnswerRecording}
          submitAnswerRecording={submitAnswerRecording}
          goToNextQuestion={goToNextQuestion}
          setQuestionIndex={setQuestionIndex}
          resetAnswerUi={resetAnswerUi}
          finishInterview={finishInterview}
          onMoveToCoding={() => setStep(4)}
          waveformLevels={waveformLevels}
          waveformPitchHz={waveformPitchHz}
        />
      )
    }

    if (step === 4) {
      return (
        <CodingStep
          cardClass={cardClass}
          mutedText={mutedText}
          headingText={headingText}
          isDark={isDark}
          language={language}
          setLanguage={setLanguage}
          codeByLanguage={codeByLanguage}
          setCodeByLanguage={setCodeByLanguage}
          codingPrompt={codingPrompt}
          runMessage={runMessage}
          setRunMessage={setRunMessage}
          finishInterview={finishInterview}
        />
      )
    }

    return null
  }

  return (
    <main
      className={`min-h-screen px-4 py-8 transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {hasStream && step >= 3 && (
        <FloatingCandidatePreview
          isDark={isDark}
          mutedText={mutedText}
          floatingVideoRef={floatingVideoRef}
          attentionOnScreen={attentionOnScreen}
          emotionLabel={emotionLabel}
        />
      )}
      <div className="mx-auto max-w-6xl space-y-6">
        {tabLeaveWarning && (step === 3 || step === 4) && !interviewCompleted && (
          <div className="scroll-mt-4">
            <TabLeaveBanner
              isDark={isDark}
              message={tabLeaveWarning}
              tabAwayEvents={tabAwayEvents}
              onDismiss={() => setTabLeaveWarning('')}
            />
          </div>
        )}
        <InterviewHeader
          cardClass={cardClass}
          mutedText={mutedText}
          headingText={headingText}
          step={step}
          progress={progress}
          autoSaveLabel={autoSaveLabel}
          showFlowControls={showFlowControls}
          isDark={isDark}
          onOpenInstructions={() => setShowInstructions(true)}
          onToggleTheme={() => setIsDark((prev) => !prev)}
        />

        {showInstructions && (
          <InstructionsModal
            isDark={isDark}
            mutedText={mutedText}
            headingText={headingText}
            onClose={() => setShowInstructions(false)}
            onToggleTheme={() => setIsDark((prev) => !prev)}
          />
        )}

        {renderStep()}
      </div>
    </main>
  )
}

export default App
