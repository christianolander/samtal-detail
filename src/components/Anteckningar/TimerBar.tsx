import { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from '@/store/useStore'
import { Pause, Play, RotateCcw, MoreVertical, EyeOff, GripVertical, Palette, Clock, Zap, Leaf, ChevronRight, Coffee, Heart, Timer } from 'lucide-react'

// Timer style options for the menu
const TIMER_STYLE_OPTIONS = [
  { id: 'default', label: 'Standard', icon: Clock, colors: ['bg-primary', 'bg-background'] },
  { id: 'minimal', label: 'Minimal', icon: null, colors: ['bg-muted', 'bg-foreground/20'] },
  { id: 'neon', label: 'Neon', icon: Zap, colors: ['bg-cyan-400', 'bg-black'] },
  { id: 'nature', label: 'Natur', icon: Leaf, colors: ['bg-emerald-500', 'bg-emerald-950'] },
  { id: 'retro', label: 'Retro', icon: Coffee, colors: ['bg-amber-700', 'bg-amber-50'] },
  { id: 'cheerful', label: 'Glad', icon: Heart, colors: ['bg-pink-500', 'bg-pink-100'] },
] as const

const SNAP_DISTANCE = 80 // Distance in pixels to trigger snap-back

// Timer style configurations
const TIMER_STYLES = {
  default: {
    container: 'bg-background/95 backdrop-blur-sm border-border',
    time: 'text-foreground',
    timeActive: 'text-primary',
    button: 'hover:bg-muted text-foreground',
    accent: 'bg-primary',
  },
  minimal: {
    container: 'bg-muted/80 backdrop-blur-sm border-transparent',
    time: 'text-muted-foreground',
    timeActive: 'text-foreground',
    button: 'hover:bg-background/50 text-muted-foreground',
    accent: 'bg-foreground',
  },
  neon: {
    container: 'bg-black/90 backdrop-blur-sm border-[#0ff]/50',
    time: 'text-[#0ff]',
    timeActive: 'text-[#0ff] drop-shadow-[0_0_10px_#0ff]',
    button: 'hover:bg-[#0ff]/20 text-[#0ff]',
    accent: 'bg-[#0ff]',
  },
  nature: {
    container: 'bg-emerald-950/95 backdrop-blur-sm border-emerald-500/30',
    time: 'text-emerald-400',
    timeActive: 'text-emerald-300',
    button: 'hover:bg-emerald-800/50 text-emerald-400',
    accent: 'bg-emerald-500',
  },
  retro: {
    container: 'bg-amber-50/95 backdrop-blur-sm border-amber-300',
    time: 'text-amber-800',
    timeActive: 'text-amber-700',
    button: 'hover:bg-amber-200/50 text-amber-700',
    accent: 'bg-amber-700',
  },
  cheerful: {
    container: 'bg-pink-50/95 backdrop-blur-sm border-pink-300',
    time: 'text-pink-600',
    timeActive: 'text-pink-500',
    button: 'hover:bg-pink-200/50 text-pink-600',
    accent: 'bg-pink-500',
  },
}

// Inject keyframes for sticky pop animation
const styleId = 'timer-bar-animation-styles'
if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
  const style = document.createElement('style')
  style.id = styleId
  style.textContent = `
    @keyframes stickyPop {
      0% {
        opacity: 0;
        transform: scale(0.7) translateY(-20px);
      }
      40% {
        opacity: 1;
        transform: scale(1.15) translateY(6px);
      }
      65% {
        transform: scale(0.95) translateY(-2px);
      }
      85% {
        transform: scale(1.03) translateY(1px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `
  document.head.appendChild(style)
}

export default function TimerBar() {
  const {
    timerActive,
    timerStartedAt,
    timerTotalSeconds,
    timerBarVisible,
    timerAlwaysVisible,
    timerMode,
    timerCountdownSeconds,
    timerStyle,
    timerBarPosition,
    pauseTimer,
    startTimer,
    resetTimer,
    hideTimerBar,
    setTimerBarPosition,
    setTimerStyle,
    activeRightPanelTab,
  } = useStore()

  const [showStyleSubmenu, setShowStyleSubmenu] = useState(false)

  const [currentSeconds, setCurrentSeconds] = useState(timerTotalSeconds)
  // Use store position for persistence across tab switches
  const position = timerBarPosition
  const setPosition = setTimerBarPosition
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isNearOrigin, setIsNearOrigin] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const dragDataRef = useRef<{
    startMouseX: number
    startMouseY: number
    startElemX: number
    startElemY: number
    hasMoved: boolean
  } | null>(null)
  const originRef = useRef<{ x: number; y: number } | null>(null)

  const styles = TIMER_STYLES[timerStyle]

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
        setShowStyleSubmenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle drag start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (!dragRef.current) return

    const rect = dragRef.current.getBoundingClientRect()

    // Get the element's position - rect is relative to viewport
    const elemX = rect.left
    const elemY = rect.top

    // Store starting positions
    dragDataRef.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startElemX: elemX,
      startElemY: elemY,
      hasMoved: false,
    }

    // Store origin position for snap-back (only on first drag from sticky)
    if (!position && !originRef.current) {
      originRef.current = { x: elemX, y: elemY }
    }

    setIsDragging(true)
  }, [position])

  // Check distance from origin
  const checkNearOrigin = useCallback((x: number, y: number) => {
    if (!originRef.current) return false
    const distance = Math.sqrt(
      Math.pow(x - originRef.current.x, 2) + Math.pow(y - originRef.current.y, 2)
    )
    return distance < SNAP_DISTANCE
  }, [])

  // Handle drag
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragDataRef.current) return

      const { startMouseX, startMouseY, startElemX, startElemY } = dragDataRef.current

      // Calculate how much the mouse has moved
      const deltaX = e.clientX - startMouseX
      const deltaY = e.clientY - startMouseY

      // New element position = starting position + mouse delta
      const newX = startElemX + deltaX
      const newY = startElemY + deltaY

      dragDataRef.current.hasMoved = true
      setPosition({ x: newX, y: newY })
      setIsNearOrigin(checkNearOrigin(newX, newY))
    }

    const handleMouseUp = () => {
      // Check if we should snap back to origin
      if (position && checkNearOrigin(position.x, position.y)) {
        setPosition(null) // Snap back to sticky flow
        originRef.current = null // Reset origin so it recalculates next time
      }
      setIsDragging(false)
      setIsNearOrigin(false)
      dragDataRef.current = null
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, position, checkNearOrigin])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (timerActive && timerStartedAt) {
      const updateTime = () => {
        const now = Date.now()
        const startTime = new Date(timerStartedAt).getTime()
        const elapsed = Math.floor((now - startTime) / 1000)

        if (timerMode === 'countdown') {
          const remaining = timerCountdownSeconds - (timerTotalSeconds + elapsed)
          setCurrentSeconds(Math.max(0, remaining))
        } else {
          setCurrentSeconds(timerTotalSeconds + elapsed)
        }
      }

      updateTime()
      interval = setInterval(updateTime, 1000)
    } else {
      // When not active
      if (timerMode === 'countdown') {
        setCurrentSeconds(timerCountdownSeconds - timerTotalSeconds)
      } else {
        setCurrentSeconds(timerTotalSeconds)
      }
    }

    return () => clearInterval(interval)
  }, [timerActive, timerStartedAt, timerTotalSeconds, timerMode, timerCountdownSeconds])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(Math.abs(seconds) / 60)
    const secs = Math.abs(seconds) % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Don't show the floating timer if:
  // 1. Not visible
  // 2. Timer tab is active (no need for duplicate display)
  // 3. Timer hasn't been started (no time accumulated and not active)
  // 4. timerAlwaysVisible is true (compact timer in header is shown instead)
  const hasTimerActivity = timerActive || timerTotalSeconds > 0
  if (!timerBarVisible || activeRightPanelTab === 'timer' || !hasTimerActivity || timerAlwaysVisible) {
    return null
  }

  const handleReset = () => {
    resetTimer()
  }

  const handleHideTimer = () => {
    setShowMenu(false)
    setShowStyleSubmenu(false)
    hideTimerBar()
  }

  const handleStyleSelect = (styleId: typeof timerStyle) => {
    setTimerStyle(styleId)
    setShowStyleSubmenu(false)
    setShowMenu(false)
  }

  // Determine positioning style - default to fixed top-right
  const getPositionStyle = (): React.CSSProperties => {
    if (position) {
      // Dragged position (user has moved the timer)
      return {
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: 9999,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }
    }
    // Default position: fixed at top-right area
    return {
      position: 'fixed',
      right: 48,
      top: 48,
      zIndex: 9999,
    }
  }

  // Timer content
  const timerContent = (
    <div
      ref={dragRef}
      style={getPositionStyle()}
      className={`
        flex items-center gap-2 border rounded-lg px-3 py-2
        transition-shadow duration-300 ease-out
        ${styles.container}
        ${isDragging ? 'cursor-grabbing shadow-2xl' : 'shadow-lg hover:shadow-xl'}
        ${!position && !isDragging ? 'animate-in fade-in slide-in-from-top-2' : ''}
        ${isNearOrigin ? 'ring-2 ring-primary/30' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        if (!showMenu) setShowMenu(false)
      }}
    >
      {/* Drag Handle - appears on hover */}
      <div
        onMouseDown={handleMouseDown}
        className={`
          flex items-center justify-center w-5 rounded cursor-grab
          transition-opacity duration-150
          ${isHovered || isDragging ? 'opacity-100' : 'opacity-0'}
          ${isDragging ? 'cursor-grabbing' : 'hover:bg-muted/50'}
        `}
      >
        <GripVertical className={`w-4 h-4 ${styles.button.split(' ')[1] || 'text-muted-foreground'}`} />
      </div>

      <div className={`flex items-center gap-1.5 font-mono font-semibold text-lg tabular-nums ${timerActive ? styles.timeActive : styles.time}`}>
        {timerMode === 'countdown' ? (
          <Clock className="w-4 h-4" />
        ) : (
          <Timer className="w-4 h-4" />
        )}
        {formatTime(currentSeconds)}
      </div>

      <div className="h-4 w-px bg-border/50" />

      <div className="flex items-center gap-0.5">
        {timerActive ? (
          <button
            onClick={pauseTimer}
            className={`p-1.5 rounded-md transition-colors ${styles.button}`}
            title="Pausa"
          >
            <Pause className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={startTimer}
            className={`p-1.5 rounded-md transition-colors ${styles.button}`}
            title="Starta"
          >
            <Play className="w-4 h-4" />
          </button>
        )}

        {/* Reset button - always visible when there's time to reset */}
        <button
          onClick={handleReset}
          disabled={timerTotalSeconds === 0 && !timerActive}
          className={`p-1.5 rounded-md transition-colors ${styles.button} ${
            timerTotalSeconds === 0 && !timerActive ? 'opacity-30 cursor-not-allowed' : ''
          }`}
          title="Återställ"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Dot Menu - appears on hover */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`
              p-1.5 rounded-md transition-all duration-150
              ${styles.button}
              ${isHovered || showMenu ? 'opacity-100' : 'opacity-0'}
            `}
            title="Fler alternativ"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[180px] z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              {/* Style Selector with submenu */}
              <div className="relative">
                <button
                  onClick={() => setShowStyleSubmenu(!showStyleSubmenu)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Timer-stil
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${showStyleSubmenu ? 'rotate-90' : ''}`} />
                </button>

                {/* Style submenu - 3x2 grid */}
                {showStyleSubmenu && (
                  <div className="absolute right-full top-0 mr-1 bg-card border border-border rounded-lg shadow-lg p-2 min-w-[280px] animate-in fade-in slide-in-from-right-1 duration-150">
                    <div className="grid grid-cols-3 gap-1.5">
                      {TIMER_STYLE_OPTIONS.map((option) => {
                        const isSelected = timerStyle === option.id
                        return (
                          <button
                            key={option.id}
                            onClick={() => handleStyleSelect(option.id as typeof timerStyle)}
                            className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border transition-all duration-200 ${
                              isSelected
                                ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                                : 'border-border hover:border-muted-foreground/30 hover:bg-muted/50'
                            }`}
                          >
                            <div className="flex gap-0.5">
                              <div className={`w-4 h-4 rounded-sm border border-border/50 ${option.colors[1]}`} />
                              <div className={`w-4 h-4 rounded-sm border border-border/50 ${option.colors[0]}`} />
                            </div>
                            <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                              {option.label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-border my-1" />

              <button
                onClick={handleHideTimer}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <EyeOff className="w-4 h-4" />
                Dölj timer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // Always render via portal since it's fixed positioned
  return createPortal(timerContent, document.body)
}
