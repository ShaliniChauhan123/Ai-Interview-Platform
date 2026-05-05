import { useEffect, useRef, useState } from 'react'

const BAR_COUNT = 28

function idleLevels() {
  return Array.from({ length: BAR_COUNT }, () => 0.1)
}

/**
 * Live frequency-band levels from the microphone while `recording` is true.
 * `audioStreamRef` must point at the same MediaStream used for recording (set before setRecording(true)).
 */
export function useRecordingWaveform(recording, audioStreamRef) {
  const [levels, setLevels] = useState(idleLevels)
  const [pitchHz, setPitchHz] = useState(null)
  const rafRef = useRef(0)
  const ctxRef = useRef(null)
  const sourceRef = useRef(null)
  const lastUiRef = useRef(0)

  useEffect(() => {
    const resetIdleAsync = () => {
      queueMicrotask(() => {
        setLevels(idleLevels())
        setPitchHz(null)
      })
    }

    if (!recording) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      try {
        sourceRef.current?.disconnect()
      } catch {
        // ignore
      }
      sourceRef.current = null
      const ctx = ctxRef.current
      if (ctx && ctx.state !== 'closed') {
        void ctx.close()
      }
      ctxRef.current = null
      resetIdleAsync()
      return
    }

    const stream = audioStreamRef.current
    if (!stream?.getAudioTracks?.().length) {
      resetIdleAsync()
      return
    }

    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) {
      resetIdleAsync()
      return
    }

    const ctx = new Ctx()
    ctxRef.current = ctx
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 1024
    analyser.smoothingTimeConstant = 0.72
    const binCount = analyser.frequencyBinCount
    const data = new Uint8Array(binCount)

    let source
    try {
      source = ctx.createMediaStreamSource(stream)
      source.connect(analyser)
      sourceRef.current = source
    } catch {
      void ctx.close()
      ctxRef.current = null
      resetIdleAsync()
      return
    }

    const sampleRate = ctx.sampleRate

    const loop = (t) => {
      analyser.getByteFrequencyData(data)

      const next = []
      for (let i = 0; i < BAR_COUNT; i += 1) {
        const t0 = i / BAR_COUNT
        const t1 = (i + 1) / BAR_COUNT
        const start = Math.floor(binCount ** t0)
        const end = Math.min(binCount, Math.max(start + 1, Math.floor(binCount ** t1)))
        let sum = 0
        for (let j = start; j < end; j += 1) {
          sum += data[j] ** 1.25
        }
        const n = end - start
        const v = sum / n / 255
        next.push(Math.min(1, v * 2.4 + 0.06))
      }

      const hzPerBin = sampleRate / analyser.fftSize
      const speechStart = Math.max(2, Math.floor(80 / hzPerBin))
      const speechEnd = Math.min(binCount - 1, Math.ceil(3400 / hzPerBin))

      let peak = 0
      let peakI = 0
      for (let k = speechStart; k < speechEnd; k += 1) {
        if (data[k] > peak) {
          peak = data[k]
          peakI = k
        }
      }
      const hz = peak > 18 ? Math.round((peakI * sampleRate) / analyser.fftSize) : null

      if (t - lastUiRef.current > 45) {
        lastUiRef.current = t
        setLevels(next)
        setPitchHz(hz)
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    void ctx.resume().then(() => {
      lastUiRef.current = performance.now()
      rafRef.current = requestAnimationFrame(loop)
    })

    return () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      try {
        source.disconnect()
      } catch {
        // ignore
      }
      sourceRef.current = null
      if (ctx.state !== 'closed') {
        void ctx.close()
      }
      if (ctxRef.current === ctx) {
        ctxRef.current = null
      }
    }
  }, [recording, audioStreamRef])

  return { levels, pitchHz }
}
