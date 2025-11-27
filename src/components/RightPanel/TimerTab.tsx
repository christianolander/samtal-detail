/**
 * TimerTab Component
 *
 * Timer settings panel with digital display, countdown/timer toggle,
 * and controls for managing meeting timers.
 */

import { useEffect, useState } from 'react'
import { useStore } from '@/store/useStore'
import { Play, Pause, RotateCcw, Timer, Clock } from 'lucide-react'

export default function TimerTab() {
  const {
    timerActive,
    timerStartedAt,
    timerTotalSeconds,
    timerMode,
    timerCountdownSeconds,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerMode,
    setCountdownSeconds,
  } = useStore()

  const [displaySeconds, setDisplaySeconds] = useState(
    timerMode === 'countdown' ? timerCountdownSeconds : timerTotalSeconds
  )
  const [isEditing, setIsEditing] = useState<'minutes' | 'seconds' | null>(null)
  const [pulseAnimation, setPulseAnimation] = useState(false)
  // Edit values - allow natural typing without formatting
  const [editMinutes, setEditMinutes] = useState('')
  const [editSeconds, setEditSeconds] = useState('')

  // Update display based on timer state
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (timerActive && timerStartedAt) {
      const updateTime = () => {
        const now = Date.now()
        const startTime = new Date(timerStartedAt).getTime()
        const elapsed = Math.floor((now - startTime) / 1000)

        if (timerMode === 'countdown') {
          const remaining = timerCountdownSeconds - (timerTotalSeconds + elapsed)
          setDisplaySeconds(Math.max(0, remaining))
        } else {
          setDisplaySeconds(timerTotalSeconds + elapsed)
        }
      }

      updateTime()
      interval = setInterval(updateTime, 1000)
    } else {
      if (timerMode === 'countdown') {
        setDisplaySeconds(timerCountdownSeconds - timerTotalSeconds)
      } else {
        setDisplaySeconds(timerTotalSeconds)
      }
    }

    return () => clearInterval(interval)
  }, [timerActive, timerStartedAt, timerTotalSeconds, timerMode, timerCountdownSeconds])

  // Trigger pulse animation on second change
  useEffect(() => {
    if (timerActive) {
      setPulseAnimation(true)
      const timeout = setTimeout(() => setPulseAnimation(false), 100)
      return () => clearTimeout(timeout)
    }
  }, [displaySeconds, timerActive])

  // When mode changes, reset display
  useEffect(() => {
    if (!timerActive && timerTotalSeconds === 0) {
      setDisplaySeconds(timerMode === 'countdown' ? timerCountdownSeconds : 0)
    }
  }, [timerMode, timerCountdownSeconds, timerActive, timerTotalSeconds])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(Math.abs(seconds) / 60)
    const secs = Math.abs(seconds) % 60
    return {
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
    }
  }

  const { minutes, seconds } = formatTime(
    timerMode === 'countdown' && !timerActive && timerTotalSeconds === 0
      ? timerCountdownSeconds
      : displaySeconds
  )

  const handleStart = () => {
    if (timerActive) {
      pauseTimer()
    } else {
      if (timerMode === 'countdown' && timerTotalSeconds === 0) {
        resetTimer()
      }
      startTimer()
    }
  }

  const handleReset = () => {
    resetTimer()
    if (timerMode === 'countdown') {
      setDisplaySeconds(timerCountdownSeconds)
    } else {
      setDisplaySeconds(0)
    }
  }

  const canEdit = !timerActive && timerMode === 'countdown'

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Mode Toggle */}
      <div className="flex items-center justify-center gap-1 bg-muted rounded-lg p-1">
        <button
          onClick={() => {
            if (!timerActive) {
              setTimerMode('countdown')
              resetTimer()
            }
          }}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            timerMode === 'countdown'
              ? 'bg-primary/15 text-primary shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Clock className="w-4 h-4" />
          Nedräkning
        </button>
        <button
          onClick={() => {
            if (!timerActive) {
              setTimerMode('timer')
              resetTimer()
            }
          }}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            timerMode === 'timer'
              ? 'bg-primary/15 text-primary shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Timer className="w-4 h-4" />
          Timer
        </button>
      </div>

      {/* Digital Timer Display */}
      <div className={`bg-muted/30 border border-border rounded-xl p-6 transition-all duration-300 ${
        timerActive ? 'shadow-lg shadow-primary/10' : ''
      }`}>
        <div className="flex items-center justify-center gap-1">
          {/* Minutes */}
          <div
            className={`relative rounded-lg px-1 py-2 transition-all duration-200 ${
              isEditing === 'minutes' ? 'bg-primary/10 ring-2 ring-primary' : 'bg-background'
            }`}
          >
            {canEdit ? (
              <input
                type="text"
                inputMode="numeric"
                value={isEditing === 'minutes' ? editMinutes : minutes}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '')
                  setEditMinutes(val)
                }}
                onFocus={() => {
                  setIsEditing('minutes')
                  // Set to unformatted current value
                  const currentMins = Math.floor(timerCountdownSeconds / 60)
                  setEditMinutes(currentMins.toString())
                }}
                onBlur={() => {
                  setIsEditing(null)
                  // Parse and apply the value
                  const mins = Math.min(99, Math.max(0, parseInt(editMinutes) || 0))
                  const currentSecs = timerCountdownSeconds % 60
                  setCountdownSeconds(mins * 60 + currentSecs)
                  setEditMinutes('')
                }}
                className={`w-[72px] bg-transparent text-center font-mono text-5xl font-bold tracking-tight focus:outline-none transition-all duration-100 text-foreground focus:text-primary`}
                style={{ fontFamily: "'Courier New', monospace" }}
              />
            ) : (
              <span
                className={`font-mono text-5xl font-bold tracking-tight transition-all duration-100 px-2 ${
                  timerActive
                    ? pulseAnimation
                      ? 'text-primary scale-[1.02]'
                      : 'text-primary'
                    : 'text-foreground'
                }`}
                style={{ fontFamily: "'Courier New', monospace" }}
              >
                {minutes}
              </span>
            )}
          </div>

          {/* Separator */}
          <div className="flex flex-col gap-2 px-1">
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              timerActive
                ? pulseAnimation
                  ? 'bg-primary scale-125'
                  : 'bg-primary'
                : 'bg-foreground/40'
            }`} />
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              timerActive
                ? pulseAnimation
                  ? 'bg-primary scale-125'
                  : 'bg-primary'
                : 'bg-foreground/40'
            }`} />
          </div>

          {/* Seconds */}
          <div
            className={`relative rounded-lg px-1 py-2 transition-all duration-200 ${
              isEditing === 'seconds' ? 'bg-primary/10 ring-2 ring-primary' : 'bg-background'
            }`}
          >
            {canEdit ? (
              <input
                type="text"
                inputMode="numeric"
                value={isEditing === 'seconds' ? editSeconds : seconds}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '')
                  setEditSeconds(val)
                }}
                onFocus={() => {
                  setIsEditing('seconds')
                  // Set to unformatted current value
                  const currentSecs = timerCountdownSeconds % 60
                  setEditSeconds(currentSecs.toString())
                }}
                onBlur={() => {
                  setIsEditing(null)
                  // Parse and apply the value - allow overflow (e.g., 120 → 2 minutes)
                  const totalSecs = Math.max(0, parseInt(editSeconds) || 0)
                  const currentMins = Math.floor(timerCountdownSeconds / 60)
                  // Add overflow minutes to current minutes
                  const extraMins = Math.floor(totalSecs / 60)
                  const remainingSecs = totalSecs % 60
                  const newMins = Math.min(99, currentMins + extraMins)
                  setCountdownSeconds(newMins * 60 + remainingSecs)
                  setEditSeconds('')
                }}
                className={`w-[72px] bg-transparent text-center font-mono text-5xl font-bold tracking-tight focus:outline-none transition-all duration-100 text-foreground focus:text-primary`}
                style={{ fontFamily: "'Courier New', monospace" }}
              />
            ) : (
              <span
                className={`font-mono text-5xl font-bold tracking-tight transition-all duration-100 px-2 ${
                  timerActive
                    ? pulseAnimation
                      ? 'text-primary scale-[1.02]'
                      : 'text-primary'
                    : 'text-foreground'
                }`}
                style={{ fontFamily: "'Courier New', monospace" }}
              >
                {seconds}
              </span>
            )}
          </div>
        </div>

        {/* Progress indicator for countdown */}
        {timerMode === 'countdown' && timerCountdownSeconds > 0 && (
          <div className="mt-6 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-linear"
              style={{
                width: `${((timerCountdownSeconds - displaySeconds) / timerCountdownSeconds) * 100}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {/* Reset Button */}
        <button
          onClick={handleReset}
          disabled={timerTotalSeconds === 0 && !timerActive}
          className={`w-12 h-12 rounded-full border-2 border-border flex items-center justify-center transition-all duration-200 ${
            timerTotalSeconds === 0 && !timerActive
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-muted hover:scale-105 active:scale-95'
          }`}
          title="Återställ"
        >
          <RotateCcw className="w-5 h-5 text-foreground" />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={handleStart}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
            timerActive
              ? 'bg-primary hover:bg-primary/90'
              : 'bg-primary hover:bg-primary/90'
          }`}
        >
          {timerActive ? (
            <Pause className="w-7 h-7 text-primary-foreground" />
          ) : (
            <Play className="w-7 h-7 text-primary-foreground ml-1" />
          )}
        </button>

        {/* Spacer for balance */}
        <div className="w-12 h-12" />
      </div>

      {/* Helper text */}
      {canEdit && (
        <p className="text-xs text-muted-foreground text-center animate-in fade-in duration-500">
          Ange tid direkt i fälten ovan
        </p>
      )}
    </div>
  )
}
