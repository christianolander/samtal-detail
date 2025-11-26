/**
 * StatusDetaljer Component
 *
 * Displays status control and meeting metadata
 * Includes timer summary when conversation is completed
 */

import { useState } from 'react'
import { useStore } from '@/store/useStore'
import ParticipantAvatar from '../shared/ParticipantAvatar'
import ConfirmModal from '../shared/ConfirmModal'
import AddParticipantModal from '../modals/AddParticipantModal'

export default function StatusDetaljer() {
  const { currentSamtal, currentStatus, setStatus, timerTotalSeconds, startTimer, stopTimer } = useStore()
  const [showTimerModal, setShowTimerModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showParticipantModal, setShowParticipantModal] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<typeof currentStatus | null>(null)

  const handleStatusChange = (newStatus: typeof currentStatus) => {
    if (newStatus === currentStatus) return

    // Planering → Pågår: Ask about timer
    if (currentStatus === 'planering' && newStatus === 'pågår') {
      setPendingStatus(newStatus)
      setShowTimerModal(true)
      return
    }

    // Pågår → Avslutat: Confirm
    if (currentStatus === 'pågår' && newStatus === 'avslutat') {
      setPendingStatus(newStatus)
      setShowCompleteModal(true)
      return
    }

    // Other transitions: just update
    setStatus(newStatus)
  }

  const handleTimerModalConfirm = () => {
    if (pendingStatus) {
      setStatus(pendingStatus)
      startTimer() // Start the timer
    }
    setShowTimerModal(false)
    setPendingStatus(null)
  }

  const handleTimerModalCancel = () => {
    if (pendingStatus) {
      setStatus(pendingStatus)
      // Don't start timer - user declined
    }
    setShowTimerModal(false)
    setPendingStatus(null)
  }

  const handleCompleteModalConfirm = () => {
    if (pendingStatus) {
      stopTimer() // Stop and save the timer
      setStatus(pendingStatus)
    }
    setShowCompleteModal(false)
    setPendingStatus(null)
  }

  const handleCompleteModalCancel = () => {
    setShowCompleteModal(false)
    setPendingStatus(null)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    return `${mins} min`
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-foreground">Status & detaljer</h4>

      {/* Status Segmented Control */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Status</label>
        <div className="grid grid-cols-3 gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => handleStatusChange('planerad')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              currentStatus === 'planerad'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Planering
          </button>
          <button
            onClick={() => handleStatusChange('bokad')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              currentStatus === 'bokad'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Pågår
          </button>
          <button
            onClick={() => handleStatusChange('klar')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              currentStatus === 'klar'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Avslutat
          </button>
        </div>
      </div>

      {/* Timer Summary (when completed) */}
      {currentStatus === 'avslutat' && timerTotalSeconds > 0 && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Samtalet varade i{' '}
            <strong className="text-foreground">{formatDuration(timerTotalSeconds)}</strong>
          </p>
        </div>
      )}

      {/* Metadata */}
      <div className="space-y-3 pt-2">
        {/* Date & Time */}
        {currentSamtal.bookedDate && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Datum & tid</p>
            <p className="text-sm text-foreground">
              {new Date(currentSamtal.bookedDate).toLocaleDateString('sv-SE', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}{' '}
              kl.{' '}
              {new Date(currentSamtal.bookedDate).toLocaleTimeString('sv-SE', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <button className="text-xs text-primary hover:underline">Redigera</button>
          </div>
        )}

        {/* Location */}
        {currentSamtal.metadata.location && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Plats</p>
            <p className="text-sm text-foreground">{currentSamtal.metadata.location}</p>
          </div>
        )}

        {/* Meeting Link */}
        {currentSamtal.metadata.meetingLink && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Länk</p>
            <a
              href={currentSamtal.metadata.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Öppna Teams-länk
            </a>
          </div>
        )}

        {/* Survey Source */}
        {currentSamtal.metadata.surveySource && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Survey källa</p>
            <p className="text-sm text-foreground">{currentSamtal.metadata.surveySource}</p>
          </div>
        )}

        {/* Participants */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Deltagare</p>
            {(currentStatus === 'planering' || currentStatus === 'bokad' || currentStatus === 'ej_bokad') && (
              <button
                onClick={() => setShowParticipantModal(true)}
                className="text-xs text-primary hover:underline"
              >
                Redigera
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {currentSamtal.participants.map((participant) => (
              <div key={participant.id} className="flex items-center gap-2">
                <ParticipantAvatar participant={participant} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{participant.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {participant.roleInSamtal}
                    {participant.title && ` • ${participant.title}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={showTimerModal}
        title="Starta timer?"
        message="Vill du starta en timer för det här samtalet? Det hjälper dig att se hur lång tid ni faktiskt använder."
        confirmText="Starta timer"
        cancelText="Inte nu"
        onConfirm={handleTimerModalConfirm}
        onCancel={handleTimerModalCancel}
      />

      <ConfirmModal
        isOpen={showCompleteModal}
        title="Avsluta samtal?"
        message="Är du säker på att samtalet är avslutat? Du kan alltid ändra tillbaka om du behöver."
        confirmText="Ja, avsluta"
        cancelText="Avbryt"
        onConfirm={handleCompleteModalConfirm}
        onCancel={handleCompleteModalCancel}
      />

      <AddParticipantModal
        isOpen={showParticipantModal}
        onClose={() => setShowParticipantModal(false)}
      />
    </div>
  )
}
