/**
 * TimerTab Component
 *
 * Timer settings panel with digital display, countdown/timer toggle,
 * style selector, and controls for managing meeting timers.
 */

import { useEffect, useState } from 'react'
import { useStore } from '@/store/useStore'
import { Play, Pause, RotateCcw, Timer, Clock, Palette, Zap, Leaf, Eye, Coffee, Heart } from 'lucide-react'

// Timer style options with preview colors and icons
const TIMER_STYLE_OPTIONS = [
  { id: 'default', label: 'Standard', icon: Clock, colors: ['bg-primary', 'bg-background'] },
  { id: 'minimal', label: 'Minimal', icon: null, colors: ['bg-muted', 'bg-foreground/20'] },
  { id: 'neon', label: 'Neon', icon: Zap, colors: ['bg-cyan-400', 'bg-black'] },
  { id: 'nature', label: 'Natur', icon: Leaf, colors: ['bg-emerald-500', 'bg-emerald-950'] },
  { id: 'retro', label: 'Retro', icon: Coffee, colors: ['bg-amber-700', 'bg-amber-50'] },
  { id: 'cheerful', label: 'Glad', icon: Heart, colors: ['bg-pink-500', 'bg-pink-100'] },
] as const

// Timer style configurations for the panel display
const TIMER_PANEL_STYLES = {
  default: {
    container: 'bg-muted/30 border-border',
    containerActive: 'shadow-lg shadow-primary/10',
    digitBg: 'bg-background',
    digitText: 'text-foreground',
    digitTextActive: 'text-primary',
    separator: 'bg-foreground/40',
    separatorActive: 'bg-primary',
    progress: 'bg-primary',
    progressBg: 'bg-muted',
  },
  minimal: {
    container: 'bg-muted/50 border-transparent',
    containerActive: 'shadow-md',
    digitBg: 'bg-background/50',
    digitText: 'text-muted-foreground',
    digitTextActive: 'text-foreground',
    separator: 'bg-muted-foreground/30',
    separatorActive: 'bg-foreground',
    progress: 'bg-foreground',
    progressBg: 'bg-muted/50',
  },
  neon: {
    container: 'bg-black/90 border-[#0ff]/50',
    containerActive: 'shadow-lg shadow-[#0ff]/20',
    digitBg: 'bg-black',
    digitText: 'text-[#0ff]/70',
    digitTextActive: 'text-[#0ff] drop-shadow-[0_0_10px_#0ff]',
    separator: 'bg-[#0ff]/30',
    separatorActive: 'bg-[#0ff] shadow-[0_0_8px_#0ff]',
    progress: 'bg-[#0ff]',
    progressBg: 'bg-[#0ff]/20',
  },
  nature: {
    container: 'bg-emerald-950/90 border-emerald-500/30',
    containerActive: 'shadow-lg shadow-emerald-500/20',
    digitBg: 'bg-emerald-950',
    digitText: 'text-emerald-400/70',
    digitTextActive: 'text-emerald-300',
    separator: 'bg-emerald-500/40',
    separatorActive: 'bg-emerald-400',
    progress: 'bg-emerald-500',
    progressBg: 'bg-emerald-800/50',
  },
  retro: {
    container: 'bg-amber-50/90 border-amber-300',
    containerActive: 'shadow-lg shadow-amber-500/20',
    digitBg: 'bg-amber-100',
    digitText: 'text-amber-800/70',
    digitTextActive: 'text-amber-700',
    separator: 'bg-amber-500/40',
    separatorActive: 'bg-amber-600',
    progress: 'bg-amber-600',
    progressBg: 'bg-amber-200/50',
  },
  cheerful: {
    container: 'bg-pink-50/90 border-pink-300',
    containerActive: 'shadow-lg shadow-pink-500/20',
    digitBg: 'bg-pink-100',
    digitText: 'text-pink-600/70',
    digitTextActive: 'text-pink-500',
    separator: 'bg-pink-400/40',
    separatorActive: 'bg-pink-500',
    progress: 'bg-pink-500',
    progressBg: 'bg-pink-200/50',
  },
}

export default function TimerTab() {
  const {
    timerActive,
    timerStartedAt,
    timerTotalSeconds,
    timerMode,
    timerCountdownSeconds,
    timerAlwaysVisible,
    timerStyle,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerMode,
    setCountdownSeconds,
    setTimerStyle,
    setTimerAlwaysVisible,
  } = useStore()

  // Get current style configuration
  const panelStyles = TIMER_PANEL_STYLES[timerStyle]

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
      <div className={`relative border rounded-xl p-6 transition-all duration-300 ${panelStyles.container} ${
        timerActive ? panelStyles.containerActive : ''
      }`}>
        <div className="flex items-center justify-center gap-1">
          {/* Minutes */}
          <div
            className={`relative rounded-lg px-1 py-2 transition-all duration-200 ${
              isEditing === 'minutes' ? 'ring-2 ring-primary/50' : ''
            } ${panelStyles.digitBg}`}
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
                className={`w-[72px] bg-transparent text-center font-mono text-5xl font-bold tracking-tight focus:outline-none transition-all duration-100 ${panelStyles.digitText}`}
                style={{ fontFamily: "'Courier New', monospace" }}
              />
            ) : (
              <span
                className={`font-mono text-5xl font-bold tracking-tight transition-all duration-100 px-2 ${
                  timerActive
                    ? pulseAnimation
                      ? `${panelStyles.digitTextActive} scale-[1.02]`
                      : panelStyles.digitTextActive
                    : panelStyles.digitText
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
                  ? `${panelStyles.separatorActive} scale-125`
                  : panelStyles.separatorActive
                : panelStyles.separator
            }`} />
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              timerActive
                ? pulseAnimation
                  ? `${panelStyles.separatorActive} scale-125`
                  : panelStyles.separatorActive
                : panelStyles.separator
            }`} />
          </div>

          {/* Seconds */}
          <div
            className={`relative rounded-lg px-1 py-2 transition-all duration-200 ${
              isEditing === 'seconds' ? 'ring-2 ring-primary/50' : ''
            } ${panelStyles.digitBg}`}
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
                className={`w-[72px] bg-transparent text-center font-mono text-5xl font-bold tracking-tight focus:outline-none transition-all duration-100 ${panelStyles.digitText}`}
                style={{ fontFamily: "'Courier New', monospace" }}
              />
            ) : (
              <span
                className={`font-mono text-5xl font-bold tracking-tight transition-all duration-100 px-2 ${
                  timerActive
                    ? pulseAnimation
                      ? `${panelStyles.digitTextActive} scale-[1.02]`
                      : panelStyles.digitTextActive
                    : panelStyles.digitText
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
          <div className={`mt-6 h-1 rounded-full overflow-hidden ${panelStyles.progressBg}`}>
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${panelStyles.progress}`}
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
        <p className="text-sm text-muted-foreground text-center animate-in fade-in duration-500">
          Ange tid direkt i fälten ovan
        </p>
      )}

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Settings Section */}
      <div className="space-y-4">
        {/* Mini Timer Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Visa liten timer</span>
          </div>
          <button
            onClick={() => setTimerAlwaysVisible(!timerAlwaysVisible)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
              timerAlwaysVisible ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                timerAlwaysVisible ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <p className="text-sm text-muted-foreground -mt-2 ml-6">
          Visar kompakt timer i verktygsfältet
        </p>

        {/* Style Selector - 3x2 grid */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Timer-stil</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {TIMER_STYLE_OPTIONS.map((option) => {
              const Icon = option.icon
              const isSelected = timerStyle === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => setTimerStyle(option.id as any)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                      : 'border-border hover:border-muted-foreground/30 hover:bg-muted/50'
                  }`}
                  title={option.label}
                >
                  <div className="flex gap-1">
                    <div className={`w-4 h-4 rounded-sm border border-border/50 ${option.colors[1]}`} />
                    <div className={`w-4 h-4 rounded-sm border border-border/50 ${option.colors[0]}`} />
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
