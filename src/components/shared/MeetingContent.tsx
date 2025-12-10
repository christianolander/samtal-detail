import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { FileText, Sparkles, Share2, MoreVertical, FileDown, Send, Edit3, X, Check, AlertTriangle, ChevronDown, CheckCircle2, Timer, Play, Pause, RotateCcw, Palette, ChevronRight, EyeOff, Clock, Zap, Leaf, Sparkles as SparklesIcon, Coffee, Heart, Loader2 } from 'lucide-react'
import ParticipantAvatar from './ParticipantAvatar'
import { Participant, User } from '../../types'

// Timer style options for the menu (same as TimerBar)
const TIMER_STYLE_OPTIONS = [
  { id: 'default', label: 'Standard', icon: Clock, colors: ['bg-primary', 'bg-background'] },
  { id: 'minimal', label: 'Minimal', icon: null, colors: ['bg-muted', 'bg-foreground/20'] },
  { id: 'neon', label: 'Neon', icon: Zap, colors: ['bg-cyan-400', 'bg-black'] },
  { id: 'nature', label: 'Natur', icon: Leaf, colors: ['bg-emerald-500', 'bg-emerald-950'] },
  { id: 'retro', label: 'Retro', icon: Coffee, colors: ['bg-amber-700', 'bg-amber-50'] },
  { id: 'cheerful', label: 'Glad', icon: Heart, colors: ['bg-pink-500', 'bg-pink-100'] },
] as const

// Compact timer style configurations
const COMPACT_TIMER_STYLES = {
  default: {
    container: 'bg-background/50 border-border',
    time: 'text-foreground',
    timeActive: 'text-primary',
    button: 'hover:bg-muted text-muted-foreground',
  },
  minimal: {
    container: 'bg-muted/50 border-transparent',
    time: 'text-muted-foreground',
    timeActive: 'text-foreground',
    button: 'hover:bg-background/50 text-muted-foreground',
  },
  neon: {
    container: 'bg-black/80 border-[#0ff]/30',
    time: 'text-[#0ff]',
    timeActive: 'text-[#0ff] drop-shadow-[0_0_6px_#0ff]',
    button: 'hover:bg-[#0ff]/20 text-[#0ff]',
  },
  nature: {
    container: 'bg-emerald-950/80 border-emerald-500/20',
    time: 'text-emerald-400',
    timeActive: 'text-emerald-300',
    button: 'hover:bg-emerald-800/50 text-emerald-400',
  },
  retro: {
    container: 'bg-amber-50/90 border-amber-300',
    time: 'text-amber-800',
    timeActive: 'text-amber-700',
    button: 'hover:bg-amber-200/50 text-amber-700',
  },
  cheerful: {
    container: 'bg-pink-50/90 border-pink-300',
    time: 'text-pink-600',
    timeActive: 'text-pink-500',
    button: 'hover:bg-pink-200/50 text-pink-600',
  },
}

type TimerStyleType = 'default' | 'minimal' | 'neon' | 'nature' | 'retro' | 'cheerful'

interface MeetingContentProps {
  participants: (Participant | User)[]
  status: 'planerad' | 'ej_bokad' | 'bokad' | 'klar' | 'completed' | 'ongoing' | 'cancelled'
  activeTab: 'notes' | 'recap'
  onTabChange: (tab: 'notes' | 'recap') => void
  notesContent: React.ReactNode
  recapContent: React.ReactNode
  onSend?: () => void
  onDownload?: () => void
  hasUnsavedChanges?: boolean
  onSave?: () => void
  isEditingNotes?: boolean
  onToggleEdit?: () => void
  lastSaved?: Date
  onMarkAsKlar?: () => void
  // Timer props
  timerActive?: boolean
  timerTotalSeconds?: number
  timerStartedAt?: Date
  onStartTimer?: () => void
  onPauseTimer?: () => void
  onResetTimer?: () => void
  // New timer visibility/style props
  timerAlwaysVisible?: boolean
  timerStyle?: TimerStyleType
  timerMode?: 'timer' | 'countdown'
  timerCountdownSeconds?: number
  onHideTimer?: () => void
  onSetTimerStyle?: (style: TimerStyleType) => void
}

export default function MeetingContent({
  participants,
  status,
  activeTab,
  onTabChange,
  notesContent,
  recapContent,
  onSend,
  onDownload,
  hasUnsavedChanges = false,
  onSave,
  isEditingNotes = false,
  onToggleEdit,
  lastSaved,
  onMarkAsKlar,
  timerActive = false,
  timerTotalSeconds = 0,
  timerStartedAt,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  timerAlwaysVisible = false,
  timerStyle = 'default',
  timerMode = 'timer',
  timerCountdownSeconds = 0,
  onHideTimer,
  onSetTimerStyle,
}: MeetingContentProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showSaveDropdown, setShowSaveDropdown] = useState(false)
  const [showSavedConfirmation, setShowSavedConfirmation] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false)
  const [showTimerMenu, setShowTimerMenu] = useState(false)
  const [showTimerStyleSubmenu, setShowTimerStyleSubmenu] = useState(false)
  const [displaySeconds, setDisplaySeconds] = useState(timerTotalSeconds)
  const [timerVisible, setTimerVisible] = useState(false)
  const [timerExiting, setTimerExiting] = useState(false)
  const timerMenuRef = useRef<HTMLDivElement>(null)
  const isCompleted = status === 'klar' || status === 'completed'

  // Get timer styles
  const timerStyles = COMPACT_TIMER_STYLES[timerStyle]

  // Determine if we should show the compact timer:
  // - Must have timerAlwaysVisible enabled
  // - Must have timer activity (active or has time accumulated)
  // - Status should be 'bokad' (meeting in progress)
  const hasTimerActivity = timerActive || timerTotalSeconds > 0
  const shouldShowTimer = status === 'bokad' && timerAlwaysVisible && hasTimerActivity

  // Handle timer enter/exit animations
  useEffect(() => {
    if (shouldShowTimer && !timerVisible) {
      // Timer should appear - cancel any exit animation and show immediately
      setTimerExiting(false)
      setTimerVisible(true)
    } else if (!shouldShowTimer && timerVisible && !timerExiting) {
      // Timer should disappear - start exit animation
      setTimerExiting(true)
      const timeout = setTimeout(() => {
        setTimerVisible(false)
        setTimerExiting(false)
      }, 200) // Match animation duration
      return () => clearTimeout(timeout)
    }
  }, [shouldShowTimer, timerVisible, timerExiting])

  // Live timer update - calculate elapsed time when timer is running
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
      // When not active
      if (timerMode === 'countdown') {
        setDisplaySeconds(Math.max(0, timerCountdownSeconds - timerTotalSeconds))
      } else {
        setDisplaySeconds(timerTotalSeconds)
      }
    }

    return () => clearInterval(interval)
  }, [timerActive, timerStartedAt, timerTotalSeconds, timerMode, timerCountdownSeconds])

  // Close timer menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (timerMenuRef.current && !timerMenuRef.current.contains(e.target as Node)) {
        setShowTimerMenu(false)
        setShowTimerStyleSubmenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Format timer display
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Determine if we should show save button:
  // - Show when not completed (normal editing)
  // - Show when completed AND actively editing (after user confirmed)
  const showSaveButton = onSave && (!isCompleted || isEditingNotes)

  // Handle save with simulated loading state
  const handleSave = async () => {
    if (isSaving) return
    setIsSaving(true)
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 800))
    onSave?.()
    setIsSaving(false)
  }

  // Handle edit button click - show confirmation modal first
  const handleEditClick = () => {
    if (isEditingNotes) {
      // User wants to stop editing - just toggle
      onToggleEdit?.()
    } else {
      // User wants to start editing - show confirmation first
      setShowEditConfirmModal(true)
    }
  }

  // Confirm editing - user accepted the modal
  const handleEditConfirm = () => {
    setShowEditConfirmModal(false)
    onTabChange('notes') // Switch to notes/anteckningar view
    onToggleEdit?.()
  }

  // Track previous lastSaved to detect actual saves (not initial load)
  const prevLastSavedRef = useRef<Date | undefined>(lastSaved)

  // Show "Sparat" confirmation briefly after save
  useEffect(() => {
    // Only show confirmation if lastSaved actually changed (not on initial mount)
    if (!hasUnsavedChanges && lastSaved && prevLastSavedRef.current !== lastSaved) {
      setShowSavedConfirmation(true)
      const timer = setTimeout(() => {
        setShowSavedConfirmation(false)
      }, 2000)
      prevLastSavedRef.current = lastSaved
      return () => clearTimeout(timer)
    }
    prevLastSavedRef.current = lastSaved
  }, [hasUnsavedChanges, lastSaved])

  const formatLastSaved = (date?: Date) => {
    if (!date) return ''
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffMinutes < 1) return 'nyss'
    if (diffMinutes < 60) return `${diffMinutes} min sedan`

    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours} tim sedan`

    return date.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="bg-card rounded-lg border border-border flex flex-col overflow-visible">
      {/* Header with avatars, segmented control, and actions - sticky at top */}
      <div className="border-b border-border bg-card sticky top-0 z-20 rounded-t-lg overflow-visible">
        {/* Row 1: Avatars, Timer, and Actions */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Participant avatars and Timer */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {participants.map((participant) => (
                <div key={participant.id} className="relative z-0 hover:z-10 transition-all">
                  <ParticipantAvatar participant={participant} size="sm" />
                </div>
              ))}
            </div>

            {/* Compact Timer - only show when timerAlwaysVisible is enabled and timer has activity */}
            {timerVisible && (
              <div
                className={`flex items-center gap-1.5 pl-2 ml-2 border-l rounded-md px-2 py-1 border transition-all duration-200 ${timerStyles.container} ${
                  timerExiting
                    ? 'opacity-0 -translate-x-2 scale-95'
                    : 'opacity-100 translate-x-0 scale-100 animate-in fade-in slide-in-from-left-2'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {timerMode === 'countdown' ? (
                    <Clock className={`w-3.5 h-3.5 ${timerStyles.button.split(' ').pop()}`} />
                  ) : (
                    <Timer className={`w-3.5 h-3.5 ${timerStyles.button.split(' ').pop()}`} />
                  )}
                  <span className={`text-sm font-mono font-medium ${timerActive ? timerStyles.timeActive : timerStyles.time}`}>
                    {formatTimer(displaySeconds)}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  {timerActive ? (
                    <button
                      onClick={onPauseTimer}
                      className={`p-1 rounded transition-colors ${timerStyles.button}`}
                      title="Pausa"
                    >
                      <Pause className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={onStartTimer}
                      className={`p-1 rounded transition-colors ${timerStyles.button}`}
                      title="Starta"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={onResetTimer}
                    disabled={timerTotalSeconds === 0 && !timerActive}
                    className={`p-1 rounded transition-colors ${timerStyles.button} ${
                      timerTotalSeconds === 0 && !timerActive ? 'opacity-30 cursor-not-allowed' : ''
                    }`}
                    title="Nollställ"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  {/* Timer Menu */}
                  <div className="relative" ref={timerMenuRef}>
                    <button
                      onClick={() => setShowTimerMenu(!showTimerMenu)}
                      className={`p-1 rounded transition-colors ${timerStyles.button}`}
                      title="Timer-alternativ"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>

                    {/* Timer Dropdown Menu */}
                    {showTimerMenu && (
                      <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[160px] z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        {/* Style Selector with submenu */}
                        <div className="relative">
                          <button
                            onClick={() => setShowTimerStyleSubmenu(!showTimerStyleSubmenu)}
                            className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Palette className="w-4 h-4" />
                              Timer-stil
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-transform ${showTimerStyleSubmenu ? 'rotate-90' : ''}`} />
                          </button>

                          {/* Style submenu - 3x2 grid - opens below instead of left to avoid clipping */}
                          {showTimerStyleSubmenu && (
                            <div className="absolute left-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg p-2 min-w-[280px] animate-in fade-in slide-in-from-top-1 duration-150">
                              <div className="grid grid-cols-3 gap-1.5">
                                {TIMER_STYLE_OPTIONS.map((option) => {
                                  const isSelected = timerStyle === option.id
                                  return (
                                    <button
                                      key={option.id}
                                      onClick={() => {
                                        onSetTimerStyle?.(option.id as TimerStyleType)
                                        setShowTimerStyleSubmenu(false)
                                        setShowTimerMenu(false)
                                      }}
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
                          onClick={() => {
                            onHideTimer?.()
                            setShowTimerMenu(false)
                            setShowTimerStyleSubmenu(false)
                          }}
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
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Last saved indicator */}
            {lastSaved && (
              <span className="text-xs text-muted-foreground mr-2">
                Senast sparad: {formatLastSaved(lastSaved)}
              </span>
            )}

            {/* Save button with dropdown - show when not completed, OR when completed and actively editing */}
            {showSaveButton && (
              <div className="relative flex">
                <button
                  onClick={handleSave}
                  disabled={(!hasUnsavedChanges && !showSavedConfirmation) || isSaving}
                  className={`px-3 py-1.5 rounded-l-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    hasUnsavedChanges || isSaving
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : showSavedConfirmation
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sparar...</span>
                    </>
                  ) : showSavedConfirmation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Sparat</span>
                    </>
                  ) : (
                    <span>{isCompleted && isEditingNotes ? 'Spara och skicka uppdateringar' : 'Spara'}</span>
                  )}
                </button>
                <button
                  onClick={() => setShowSaveDropdown(!showSaveDropdown)}
                  disabled={isSaving}
                  className={`px-1.5 py-1.5 rounded-r-md border-l text-sm font-medium transition-colors ${
                    hasUnsavedChanges || isSaving
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary-foreground/20'
                      : showSavedConfirmation
                      ? 'bg-primary text-primary-foreground border-primary-foreground/20'
                      : 'bg-muted text-muted-foreground border-border'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Save Dropdown Menu */}
                {showSaveDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowSaveDropdown(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-64 bg-popover border border-border rounded-md shadow-lg z-20">
                      <button
                        onClick={async () => {
                          setShowSaveDropdown(false)
                          await handleSave()
                        }}
                        disabled={!hasUnsavedChanges || isSaving}
                        className="w-full px-3 py-2.5 text-sm text-left hover:bg-muted flex items-center gap-2 rounded-t-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="flex-1">{isCompleted && isEditingNotes ? 'Spara och skicka uppdateringar' : 'Spara'}</span>
                      </button>
                      <button
                        onClick={async () => {
                          setShowSaveDropdown(false)
                          if (hasUnsavedChanges) {
                            await handleSave()
                          }
                          onMarkAsKlar?.()
                        }}
                        disabled={isSaving}
                        className="w-full px-3 py-2.5 text-sm text-left hover:bg-muted flex items-center gap-2 rounded-b-md border-t border-border disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="flex-1">Spara och markera som klar</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Edit button - only show when status is 'klar' and NOT currently editing */}
            {isCompleted && onToggleEdit && !isEditingNotes && (
              <button
                onClick={handleEditClick}
                className="px-3 py-1.5 rounded-md text-sm font-medium border border-border hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Redigera</span>
              </button>
            )}

            <button
              onClick={onSend}
              className="px-3 py-1.5 rounded-md text-sm font-medium border border-border hover:bg-muted transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Dela</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 rounded-md hover:bg-muted transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {showMoreMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMoreMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-lg z-20">
                    <button
                      onClick={() => {
                        onDownload?.()
                        setShowMoreMenu(false)
                      }}
                      className="w-full px-3 py-2 text-sm text-left hover:bg-muted flex items-center gap-2 rounded-md"
                    >
                      <FileDown className="w-4 h-4" />
                      Download as PDF
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Segmented control - Only visible if completed */}
        {isCompleted && (
          <div className="px-4 pb-3">
            <div className="flex gap-1 p-1 bg-muted/50 rounded-lg w-full border border-border/50">
              <button
                onClick={() => onTabChange('recap')}
                className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'recap'
                    ? 'bg-primary/15 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Sammanfattning</span>
              </button>
              <button
                onClick={() => onTabChange('notes')}
                className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'notes'
                    ? 'bg-primary/15 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Anteckningar</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      {/* For non-completed meetings, always show notes (no AI summary available yet) */}
      <div className="flex-1">
        {isCompleted && activeTab === 'recap' ? recapContent : notesContent}
      </div>

      {/* Edit Confirmation Modal */}
      {showEditConfirmModal && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full mx-4 animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-5">
                <AlertTriangle className="w-7 h-7 text-amber-500" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Redigera klarmarkerat samtal
                  </h2>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                När du sparat nya anteckningar kommer vi skicka ut uppdateringar till alla deltagare.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditConfirmModal(false)}
                  className="flex-1 px-5 py-3 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleEditConfirm}
                  className="flex-1 px-5 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Redigera anteckningar</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
