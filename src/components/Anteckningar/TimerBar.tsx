import { useEffect, useState } from 'react'
import { useStore } from '@/store/useStore'
import { Pause, Play, RotateCcw } from 'lucide-react'

export default function TimerBar() {
  const { timerActive, timerStartedAt, timerPausedAt, timerTotalSeconds, pauseTimer, startTimer, resetTimer } = useStore()
  const [currentSeconds, setCurrentSeconds] = useState(timerTotalSeconds)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (timerActive && timerStartedAt) {
      // Update immediately
      const updateTime = () => {
        const now = Date.now()
        const startTime = new Date(timerStartedAt).getTime()
        const elapsed = Math.floor((now - startTime) / 1000)
        setCurrentSeconds(timerTotalSeconds + elapsed)
      }
      
      updateTime()
      interval = setInterval(updateTime, 1000)
    } else {
      // Just show total if paused/stopped
      setCurrentSeconds(timerTotalSeconds)
    }

    return () => clearInterval(interval)
  }, [timerActive, timerStartedAt, timerTotalSeconds])

  // When timer is paused or stopped, show the total accumulated time
  useEffect(() => {
    if (!timerActive) {
      setCurrentSeconds(timerTotalSeconds)
    }
  }, [timerActive, timerTotalSeconds])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!timerActive && timerTotalSeconds === 0 && !timerPausedAt) {
    return null
  }

  return (
    <div className="flex items-center gap-3 bg-background border border-border rounded-full px-4 py-2 shadow-sm animate-in fade-in slide-in-from-top-2">
      <div className={`font-mono font-medium text-lg ${timerActive ? 'text-primary' : 'text-muted-foreground'}`}>
        {formatTime(currentSeconds)}
      </div>
      
      <div className="h-4 w-px bg-border" />
      
      <div className="flex items-center gap-1">
        {timerActive ? (
          <button
            onClick={pauseTimer}
            className="p-1.5 hover:bg-muted rounded-full text-foreground transition-colors"
            title="Pausa"
          >
            <Pause className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={startTimer}
            className="p-1.5 hover:bg-muted rounded-full text-foreground transition-colors"
            title="Starta"
          >
            <Play className="w-4 h-4" />
          </button>
        )}
        
        <button
          onClick={resetTimer}
          className="p-1.5 hover:bg-red-50 text-red-600 rounded-full transition-colors"
          title="Återställ"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
