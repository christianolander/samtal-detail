/**
 * StatusDetaljer Component
 *
 * Redesigned info panel with:
 * - Better headers and consistent section styling
 * - Duration editor (editable when status is not 'klar')
 * - Rich status dropdown with icons and descriptions
 * - Enhanced confirmation modal for marking as 'klar'
 */

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from '@/store/useStore'
import ParticipantAvatar from '../shared/ParticipantAvatar'
import AddParticipantModal from '../modals/AddParticipantModal'
import BookingSection, { BookingModal } from './BookingSection'
import {
  Clock,
  CheckCircle2,
  Send,
  PartyPopper,
  Circle,
  CalendarCheck,
  Calendar,
  MessageSquare,
  Bell,
  CalendarClock,
  Lock,
  FolderOpen,
} from 'lucide-react'

// Status configuration - minimal with label, description, icon and action
const STATUS_CONFIG = {
  ej_bokad: {
    icon: Circle,
    label: 'Ej bokad',
    description: 'Samtalet har inte bokats in än.',
    actionLabel: 'Skapa bokning',
    actionType: 'booking' as const,
  },
  planerad: {
    icon: Calendar,
    label: 'Planerad',
    description: 'Samtalet är planerat men inte bokat.',
    actionLabel: 'Skapa bokning',
    actionType: 'booking' as const,
  },
  bokad: {
    icon: CalendarCheck,
    label: 'Bokad',
    description: 'Samtalet är inbokat och väntar på genomförande.',
    actionLabel: 'Markera som klar',
    actionType: 'complete' as const,
  },
  klar: {
    icon: CheckCircle2,
    label: 'Klar 🙌',
    description: 'Samtalet är genomfört.',
    actionLabel: null,
    actionType: null,
  },
} as const

export default function StatusDetaljer() {
  const {
    currentSamtal,
    currentStatus,
    setStatus,
    setBooking,
    timerTotalSeconds,
    stopTimer,
  } = useStore()

  const [showParticipantModal, setShowParticipantModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([])

  const handleMarkAsKlar = () => {
    setShowCompleteModal(true)
  }

  const handleCompleteConfirm = () => {
    stopTimer()
    setStatus('klar')
    setShowCompleteModal(false)

    // Generate confetti pieces
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    setConfettiPieces(pieces)

    // Show success modal
    setShowSuccessModal(true)

    // In a real app, this would trigger sending the summary
    console.log('Sending summary to participants...')
  }

  // Clear confetti after animation
  useEffect(() => {
    if (confettiPieces.length > 0) {
      const timer = setTimeout(() => {
        setConfettiPieces([])
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [confettiPieces])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    return `${mins} min`
  }

  const currentConfig = STATUS_CONFIG[currentStatus as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.ej_bokad
  const isEditable = currentStatus !== 'klar'

  // Handle action button click
  const handleActionClick = () => {
    if (currentConfig.actionType === 'complete') {
      handleMarkAsKlar()
    } else if (currentConfig.actionType === 'booking') {
      setShowBookingModal(true)
    }
  }

  // Check if there's a booking
  const hasBooking = !!currentSamtal.bookedDate

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Status Section */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">
          Status
        </h3>

        <div className={`p-4 rounded-lg border space-y-4 ${
          currentStatus === 'klar'
            ? 'bg-primary/10 border-primary/20'
            : 'bg-card border-border'
        }`}>
          {/* Status info */}
          <div>
            <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <currentConfig.icon className={`w-4 h-4 ${currentStatus === 'klar' ? 'text-primary' : 'text-muted-foreground'}`} />
              {currentConfig.label}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {currentConfig.description}
            </p>
          </div>

          {/* Action button - only show if there's an action */}
          {currentConfig.actionLabel && (
            <button
              onClick={handleActionClick}
              className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors"
            >
              {currentConfig.actionLabel}
            </button>
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

      {/* Booking Section - only show when there's a booking */}
      {hasBooking && <BookingSection />}

      {/* Samtal Details Section */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">
          Samtalsdetaljer
        </h3>

        <div className="space-y-2">
          {/* Samtalsomgång */}
          <div className="p-3 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-1">
              <FolderOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Samtalsomgång</span>
              <Lock className="w-3 h-3 text-muted-foreground/50 ml-auto" />
            </div>
            <p className="text-sm font-medium text-foreground pl-6">{currentSamtal.conversationRound}</p>
          </div>

          {/* Type of Samtal */}
          <div className="p-3 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Typ</span>
              <Lock className="w-3 h-3 text-muted-foreground/50 ml-auto" />
            </div>
            <p className="text-sm font-medium text-foreground pl-6">{currentSamtal.type}</p>
          </div>

          {/* Påminnelser */}
          <div className="p-3 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Påminnelser</span>
              <Lock className="w-3 h-3 text-muted-foreground/50 ml-auto" />
            </div>
            <p className="text-sm font-medium text-foreground pl-6">Varje vecka</p>
          </div>

          {/* Genomför senast */}
          <div className="p-3 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-1">
              <CalendarClock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Genomför senast</span>
              <Lock className="w-3 h-3 text-muted-foreground/50 ml-auto" />
            </div>
            <p className="text-sm font-medium text-foreground pl-6">
              {currentSamtal.deadlineDate.toLocaleDateString('sv-SE', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Participants Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">
            Deltagare
          </h3>
          {isEditable && (
            <button
              onClick={() => setShowParticipantModal(true)}
              className="text-sm text-primary hover:underline font-medium"
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
                <p className="text-sm text-muted-foreground truncate">
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
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full mx-4 animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-primary/15 rounded-full">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Markera samtalet som klart?
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Bekräfta att samtalet är genomfört
                  </p>
                </div>
              </div>

              {/* Main explanation */}
              <p className="text-sm text-foreground mb-5 leading-relaxed">
                När du markerar samtalet som klart skickas anteckningarna från mötet till alla deltagare.
              </p>

              {/* Additional note */}
              <div className="p-4 bg-muted/50 rounded-lg border border-border mb-8">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Du kan fortfarande redigera anteckningarna efteråt, men alla ändringar kommer automatiskt skickas som uppdateringar till deltagarna.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowCompleteModal(false)}
                  className="flex-1 px-5 py-3 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleCompleteConfirm}
                  className="flex-1 px-5 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Markera som klar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal with Confetti */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          {/* Confetti */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {confettiPieces.map((piece) => (
              <div
                key={piece.id}
                className="absolute w-3 h-3 rounded-sm animate-confetti"
                style={{
                  left: `${piece.left}%`,
                  top: '-20px',
                  backgroundColor: piece.color,
                  animationDelay: `${piece.delay}s`,
                }}
              />
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full mx-4 animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/15 rounded-full">
                  <PartyPopper className="w-10 h-10 text-primary" />
                </div>
              </div>

              <h2 className="text-xl font-semibold text-foreground mb-3">
                Samtalet är markerat som klart!
              </h2>

              <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-sm mx-auto">
                Vi skickar nu anteckningarna från mötet till alla deltagare.
              </p>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors"
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}

      <AddParticipantModal
        isOpen={showParticipantModal}
        onClose={() => setShowParticipantModal(false)}
      />

      {/* Booking Modal */}
      {showBookingModal &&
        createPortal(
          <BookingModal
            isOpen={showBookingModal}
            onClose={() => setShowBookingModal(false)}
            onSave={(date, duration, location, meetingLink) => {
              setBooking(date, duration, location, meetingLink)
              setShowBookingModal(false)
            }}
          />,
          document.body
        )}
    </div>
  )
}
