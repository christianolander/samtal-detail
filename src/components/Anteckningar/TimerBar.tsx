import { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from '@/store/useStore'
import { Pause, Play, Square, X, GripVertical } from 'lucide-react'

const SNAP_DISTANCE = 80 // Distance in pixels to trigger snap-back
const HEADER_HEIGHT = 200 // Height of the header area (breadcrumbs + title + tabs + some padding)

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
    timerMode,
    timerCountdownSeconds,
    pauseTimer,
    startTimer,
    stopTimer,
    hideTimerBar,
    activeRightPanelTab,
  } = useStore()

  const [currentSeconds, setCurrentSeconds] = useState(timerTotalSeconds)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isNearOrigin, setIsNearOrigin] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [justBecameSticky, setJustBecameSticky] = useState(false)
  const wasSticky = useRef(false)
  const dragRef = useRef<HTMLDivElement>(null)
  const placeholderRef = useRef<HTMLDivElement>(null)
  const dragDataRef = useRef<{
    startMouseX: number
    startMouseY: number
    startElemX: number
    startElemY: number
    hasMoved: boolean
  } | null>(null)
  const originRef = useRef<{ x: number; y: number } | null>(null)

  // Store the initial position for sticky mode
  const initialPosRef = useRef<{ top: number; left: number; width: number } | null>(null)

  // Capture initial position on mount
  useEffect(() => {
    if (dragRef.current && !initialPosRef.current && !position) {
      const rect = dragRef.current.getBoundingClientRect()
      initialPosRef.current = { top: rect.top, left: rect.left, width: rect.width }
    }
  }, [position])

  // Track when timer should become sticky (scrolled out of view)
  useEffect(() => {
    if (position) return // Don't track when dragged

    const checkSticky = () => {
      if (placeholderRef.current && initialPosRef.current) {
        const rect = placeholderRef.current.getBoundingClientRect()
        // Become sticky when the placeholder scrolls above a threshold
        setIsSticky(rect.top < -20) // Goes sticky when scrolled 20px past the top
      }
    }

    window.addEventListener('scroll', checkSticky, true)
    checkSticky()

    return () => window.removeEventListener('scroll', checkSticky, true)
  }, [position])

  // Detect transition to sticky and trigger pop animation
  useEffect(() => {
    if (isSticky && !wasSticky.current) {
      // Just became sticky - trigger animation
      setJustBecameSticky(true)
      const timer = setTimeout(() => {
        setJustBecameSticky(false)
      }, 600) // Animation duration
      return () => clearTimeout(timer)
    }
    wasSticky.current = isSticky
  }, [isSticky])

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

  // Don't show if not visible OR if timer tab is active (no need for duplicate display)
  if (!timerBarVisible || activeRightPanelTab === 'timer') {
    return null
  }

  const handleStop = () => {
    stopTimer()
  }

  const handleClose = () => {
    hideTimerBar()
  }

  // Determine positioning style
  const getPositionStyle = (): React.CSSProperties | undefined => {
    if (position) {
      // Dragged position
      return {
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: 9999,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }
    }
    if (isSticky && initialPosRef.current) {
      // Sticky position - stay at original position with optional pop animation
      // Add 60px offset to position below the toolbar
      return {
        position: 'fixed',
        left: initialPosRef.current.left,
        top: initialPosRef.current.top + 60,
        zIndex: 9999,
        animation: justBecameSticky ? 'stickyPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)' : undefined,
      }
    }
    return undefined
  }

  // Timer content
  const timerContent = (
    <div
      ref={dragRef}
      style={getPositionStyle()}
      className={`
        flex items-center gap-2 bg-background/95 backdrop-blur-sm border rounded-full px-3 py-2
        shadow-lg hover:shadow-xl transition-shadow duration-200
        ${isDragging && position ? 'cursor-grabbing shadow-2xl' : ''}
        ${isDragging && !position ? 'cursor-grabbing' : ''}
        ${!position && !isSticky && !isDragging ? 'animate-in fade-in slide-in-from-top-2' : ''}
        ${isNearOrigin ? 'border-primary/50 ring-2 ring-primary/20' : 'border-border'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle - appears on hover */}
      <div
        onMouseDown={handleMouseDown}
        className={`
          flex items-center justify-center w-5 rounded cursor-grab
          transition-opacity duration-150
          ${isHovered || isDragging ? 'opacity-100' : 'opacity-0'}
          ${isDragging ? 'cursor-grabbing' : 'hover:bg-muted'}
        `}
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className={`font-mono font-medium text-lg ${timerActive ? 'text-primary' : 'text-muted-foreground'}`}>
        {formatTime(currentSeconds)}
      </div>

      <div className="h-4 w-px bg-border" />

      <div className="flex items-center gap-1">
        {timerActive ? (
          <>
            <button
              onClick={pauseTimer}
              className="p-1.5 hover:bg-muted rounded-full text-foreground transition-colors"
              title="Pausa"
            >
              <Pause className="w-4 h-4" />
            </button>
            <button
              onClick={handleStop}
              className="p-1.5 hover:bg-muted rounded-full text-foreground transition-colors"
              title="Stoppa"
            >
              <Square className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={startTimer}
              className="p-1.5 hover:bg-muted rounded-full text-foreground transition-colors"
              title="Starta"
            >
              <Play className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-muted rounded-full text-muted-foreground transition-colors"
              title="Stäng timer"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  )

  // Always render placeholder to track position, plus the actual timer
  return (
    <>
      {/* Invisible placeholder to track original position */}
      <div ref={placeholderRef} className="h-0" />

      {/* Timer - render in portal when sticky or dragged */}
      {(position || isSticky)
        ? createPortal(timerContent, document.body)
        : timerContent
      }
    </>
  )
}
