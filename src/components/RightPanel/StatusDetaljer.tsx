/**
 * StatusDetaljer Component
 *
 * Redesigned info panel with:
 * - Better headers and consistent section styling
 * - Duration editor (editable when status is not 'klar')
 * - Rich status dropdown with icons and descriptions
 * - Enhanced confirmation modal for marking as 'klar'
 */

import { useState, useRef, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import ParticipantAvatar from '../shared/ParticipantAvatar'
import AddParticipantModal from '../modals/AddParticipantModal'
import {
  Clock,
  Calendar,
  MapPin,
  Users,
  Link as LinkIcon,
  ChevronDown,
  Check,
  Circle,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  Minus,
  Plus,
  Send,
} from 'lucide-react'

// Status configuration with icons, titles, subtitles - using semantic colors
const STATUS_CONFIG = {
  ej_bokad: {
    icon: Circle,
    label: 'Ej bokad',
    description: 'Samtalet är inte schemalagt ännu',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/50',
    borderColor: 'border-border',
    iconBg: 'bg-muted',
  },
  planerad: {
    icon: AlertCircle,
    label: 'Planerad',
    description: 'Samtalet är planerat men saknar tid',
    color: 'text-foreground',
    bgColor: 'bg-muted/50',
    borderColor: 'border-border',
    iconBg: 'bg-muted',
  },
  bokad: {
    icon: CalendarCheck,
    label: 'Bokad',
    description: 'Samtalet har en schemalagd tid',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    iconBg: 'bg-primary/15',
  },
  klar: {
    icon: CheckCircle2,
    label: 'Klar',
    description: 'Samtalet är genomfört och dokumenterat',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    iconBg: 'bg-primary/15',
  },
} as const

export default function StatusDetaljer() {
  const {
    currentSamtal,
    currentStatus,
    setStatus,
    timerTotalSeconds,
    startTimer,
    stopTimer,
    setDuration,
  } = useStore()

  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showParticipantModal, setShowParticipantModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [sendSummary, setSendSummary] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleStatusChange = (newStatus: typeof currentStatus) => {
    if (newStatus === currentStatus) {
      setShowStatusDropdown(false)
      return
    }

    // When changing from bokad to klar, show confirmation modal
    if (currentStatus === 'bokad' && newStatus === 'klar') {
      setShowStatusDropdown(false)
      setShowCompleteModal(true)
      return
    }

    // Other transitions: just update
    setStatus(newStatus)
    setShowStatusDropdown(false)
  }

  const handleCompleteConfirm = () => {
    stopTimer()
    setStatus('klar')
    setShowCompleteModal(false)
    if (sendSummary) {
      // In a real app, this would trigger sending the summary
      console.log('Sending summary to participants...')
    }
  }

  const handleDurationChange = (delta: number) => {
    const currentDuration = currentSamtal.duration || 60
    const newDuration = Math.max(15, Math.min(180, currentDuration + delta))
    setDuration(newDuration)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    return `${mins} min`
  }

  const currentConfig = STATUS_CONFIG[currentStatus as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.ej_bokad
  const CurrentIcon = currentConfig.icon
  const isEditable = currentStatus !== 'klar'

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Status Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-muted-foreground tracking-wide">
            Status
          </h3>
        </div>

        {/* Rich Status Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${currentConfig.bgColor} ${currentConfig.borderColor} hover:shadow-sm`}
          >
            <div className={`p-2 rounded-md ${currentConfig.iconBg}`}>
              <CurrentIcon className={`w-5 h-5 ${currentConfig.color}`} />
            </div>
            <div className="flex-1 text-left">
              <p className={`text-sm font-semibold ${currentConfig.color}`}>
                {currentConfig.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentConfig.description}
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                showStatusDropdown ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {showStatusDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {Object.entries(STATUS_CONFIG).map(([status, config]) => {
                const Icon = config.icon
                const isActive = status === currentStatus

                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status as typeof currentStatus)}
                    className={`w-full flex items-center gap-3 p-3 transition-colors ${
                      isActive
                        ? `${config.bgColor}`
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className={`p-2 rounded-md ${config.iconBg}`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-medium ${isActive ? config.color : 'text-foreground'}`}>
                        {config.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {config.description}
                      </p>
                    </div>
                    {isActive && (
                      <Check className={`w-4 h-4 ${config.color}`} />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Timer Summary (when completed) */}
      {currentStatus === 'klar' && timerTotalSeconds > 0 && (
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <p className="text-sm text-foreground">
              Samtalet varade i{' '}
              <strong className="text-primary">{formatDuration(timerTotalSeconds)}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Date, Time & Duration Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-muted-foreground tracking-wide">
            Datum & tid
          </h3>
        </div>
        <div className="space-y-2">
          {/* Date & Time */}
          {currentSamtal.bookedDate && (
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
              <div className="p-2 bg-background rounded-md">
                <Calendar className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {new Date(currentSamtal.bookedDate).toLocaleDateString('sv-SE', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  kl.{' '}
                  {new Date(currentSamtal.bookedDate).toLocaleTimeString('sv-SE', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {isEditable && (
                <button className="text-xs text-primary hover:underline font-medium">
                  Ändra
                </button>
              )}
            </div>
          )}

          {/* Duration */}
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
            <div className="p-2 bg-background rounded-md">
              <Clock className="w-5 h-5 text-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {currentSamtal.duration || 60} minuter
              </p>
              <p className="text-xs text-muted-foreground">
                Planerad längd
              </p>
            </div>
            {isEditable && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDurationChange(-15)}
                  className="p-1.5 hover:bg-muted rounded-md transition-colors"
                  title="Minska med 15 min"
                >
                  <Minus className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleDurationChange(15)}
                  className="p-1.5 hover:bg-muted rounded-md transition-colors"
                  title="Öka med 15 min"
                >
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Location Section */}
      {currentSamtal.metadata.location && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold text-muted-foreground tracking-wide">
              Plats
            </h3>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
            <div className="p-2 bg-background rounded-md">
              <MapPin className="w-5 h-5 text-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground flex-1">
              {currentSamtal.metadata.location}
            </p>
          </div>
        </section>
      )}

      {/* Meeting Link Section */}
      {currentSamtal.metadata.meetingLink && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold text-muted-foreground tracking-wide">
              Möteslänk
            </h3>
          </div>
          <a
            href={currentSamtal.metadata.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
          >
            <div className="p-2 bg-background rounded-md">
              <LinkIcon className="w-5 h-5 text-foreground" />
            </div>
            <p className="text-sm font-medium text-primary group-hover:underline flex-1">
              Öppna Teams-länk
            </p>
          </a>
        </section>
      )}

      {/* Participants Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground tracking-wide">
            Deltagare
          </h3>
          {isEditable && (
            <button
              onClick={() => setShowParticipantModal(true)}
              className="text-xs text-primary hover:underline font-medium"
            >
              Redigera
            </button>
          )}
        </div>
        <div className="space-y-2">
          {currentSamtal.participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border"
            >
              <ParticipantAvatar participant={participant} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground truncate">
                    {participant.name}
                  </p>
                  {participant.roleInSamtal === 'Ansvarig' && (
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                      Ansvarig
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {participant.roleInSamtal !== 'Ansvarig' && `${participant.roleInSamtal} • `}
                  {participant.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Confirmation Modal for marking as Klar */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/15 rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Markera som klar?
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Bekräfta att samtalet är genomfört
                  </p>
                </div>
              </div>

              {/* Send summary option */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={sendSummary}
                      onChange={(e) => setSendSummary(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${
                        sendSummary
                          ? 'bg-primary border-primary'
                          : 'border-border bg-background'
                      }`}
                    >
                      {sendSummary && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        Skicka sammanfattning
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      En sammanfattning av samtalet skickas automatiskt till alla deltagare via e-post
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCompleteModal(false)}
                  className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleCompleteConfirm}
                  className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors"
                >
                  Ja, markera som klar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddParticipantModal
        isOpen={showParticipantModal}
        onClose={() => setShowParticipantModal(false)}
      />
    </div>
  )
}
