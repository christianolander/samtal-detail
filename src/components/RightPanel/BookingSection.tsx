/**
 * BookingSection Component
 *
 * Displays booking info (date, time, place) in the right panel.
 * Features:
 * - Info view when booked: shows date, time, place with edit/remove buttons
 * - "Skapa bokning" button when not booked
 * - Modal for creating/editing bookings
 */

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from '@/store/useStore'
import {
  Calendar,
  Clock,
  MapPin,
  Pencil,
  Trash2,
  X,
  Plus,
  Video,
  ExternalLink,
} from 'lucide-react'

// Helper to detect meeting provider from URL
function getMeetingProvider(url: string): {
  name: string
  icon: React.ReactNode
} {
  const lowerUrl = url.toLowerCase()

  if (lowerUrl.includes('meet.google.com') || lowerUrl.includes('google.com/meet')) {
    return {
      name: 'Google Meet',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M12 11.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          <path d="M15.29 15.71l4.39 3.08c.22.15.5.18.74.07.24-.11.41-.33.45-.59L22 6.82c.04-.27-.08-.54-.3-.7-.22-.16-.51-.18-.75-.05L16.75 9H15V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-2h1.29z" />
        </svg>
      ),
    }
  }

  if (lowerUrl.includes('teams.microsoft.com') || lowerUrl.includes('teams.live.com')) {
    return {
      name: 'Microsoft Teams',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M19.19 8.77c-.73 0-1.37-.29-1.85-.77h-.02c.54.9.85 1.96.85 3.08v5.08c0 .73-.13 1.43-.37 2.08h3.27c1.09 0 1.97-.88 1.97-1.97v-3.97c0-1.97-1.88-3.53-3.85-3.53zM20.5 6.5c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM16 11.08c0-2.08-1.67-3.83-3.83-3.83H7.83C5.67 7.25 4 8.92 4 11v5.17c0 1.01.82 1.83 1.83 1.83h6.5c1.01 0 1.83-.82 1.83-1.83l.01-5.09zM9.92 4.5c0 1.24-1.01 2.25-2.25 2.25S5.42 5.74 5.42 4.5 6.43 2.25 7.67 2.25s2.25 1.01 2.25 2.25zM14.25 5c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
        </svg>
      ),
    }
  }

  if (lowerUrl.includes('zoom.us') || lowerUrl.includes('zoom.com')) {
    return {
      name: 'Zoom',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M4.585 8.568a1.25 1.25 0 00-1.25 1.25v4.364a1.25 1.25 0 001.25 1.25h8.75a1.25 1.25 0 001.25-1.25V9.818a1.25 1.25 0 00-1.25-1.25H4.585zM16.335 9.393l3.75-2.081a.625.625 0 01.918.552v8.272a.625.625 0 01-.918.552l-3.75-2.081V9.393z" />
        </svg>
      ),
    }
  }

  // Default video icon
  return {
    name: 'Videomöte',
    icon: <Video className="w-4 h-4" />,
  }
}

export default function BookingSection() {
  const { currentSamtal, setBooking, removeBooking, currentStatus } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)

  const hasBooking = currentSamtal.bookedDate
  const isEditable = currentStatus !== 'klar'

  const formatDate = (date: Date) => {
    const formatted = new Date(date).toLocaleDateString('sv-SE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
    // Capitalize first letter of weekday
    return formatted.charAt(0).toUpperCase() + formatted.slice(1)
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('sv-SE', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getRelativeDateText = (date: Date) => {
    const now = new Date()
    const target = new Date(date)

    // Reset time parts for accurate day comparison
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const targetDate = new Date(target.getFullYear(), target.getMonth(), target.getDate())

    const diffTime = targetDate.getTime() - nowDate.getTime()
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Idag'
    if (diffDays === 1) return 'Imorgon'
    if (diffDays === -1) return 'Igår'
    if (diffDays > 1 && diffDays <= 7) return `Om ${diffDays} dagar`
    if (diffDays > 7 && diffDays <= 14) return 'Om en vecka'
    if (diffDays > 14) return `Om ${Math.round(diffDays / 7)} veckor`
    if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} dagar sedan`
    if (diffDays < -7 && diffDays >= -14) return 'En vecka sedan'
    if (diffDays < -14) return `${Math.abs(Math.round(diffDays / 7))} veckor sedan`

    return ''
  }

  const formatDuration = (minutes: number) => {
    // 90 minutes and below: show only minutes
    if (minutes <= 90) return `${minutes} minuter`

    // Above 90 minutes: show hours and minutes
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (remainingMinutes === 0) {
      return hours === 1 ? '1 timme' : `${hours} timmar`
    }
    return `${hours} tim ${remainingMinutes} min`
  }

  const handleRemoveBooking = () => {
    removeBooking()
    setShowRemoveConfirm(false)
  }

  return (
    <>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">
            Bokning
          </h3>
          {hasBooking && isEditable && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowModal(true)}
                className="p-1.5 hover:bg-muted rounded-md transition-colors"
                title="Redigera bokning"
              >
                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <button
                onClick={() => setShowRemoveConfirm(true)}
                className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors"
                title="Ta bort bokning"
              >
                <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          )}
        </div>

        {hasBooking ? (
          /* Booked state - show info */
          <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
            {/* Date Row */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-background rounded-md flex-shrink-0">
                <Calendar className="w-4 h-4 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {formatDate(new Date(currentSamtal.bookedDate!))}
                </p>
                <p className="text-sm text-muted-foreground">
                  {getRelativeDateText(new Date(currentSamtal.bookedDate!))}
                </p>
              </div>
            </div>

            {/* Time & Duration Row */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-background rounded-md flex-shrink-0">
                <Clock className="w-4 h-4 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {formatTime(new Date(currentSamtal.bookedDate!))}
                </p>
                {currentSamtal.duration && (
                  <p className="text-sm text-muted-foreground">
                    {formatDuration(currentSamtal.duration)}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            {currentSamtal.metadata.location && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background rounded-md flex-shrink-0">
                  <MapPin className="w-4 h-4 text-foreground" />
                </div>
                <p className="text-sm text-foreground">
                  {currentSamtal.metadata.location}
                </p>
              </div>
            )}

            {/* Meeting Link */}
            {currentSamtal.metadata.meetingLink && (() => {
              const provider = getMeetingProvider(currentSamtal.metadata.meetingLink!)
              return (
                <a
                  href={currentSamtal.metadata.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group"
                >
                  <div className="p-2 bg-background rounded-md flex-shrink-0 text-primary">
                    {provider.icon}
                  </div>
                  <span className="text-sm text-primary group-hover:underline flex items-center gap-1.5">
                    Öppna {provider.name}
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </a>
              )
            })()}
          </div>
        ) : (
          /* No booking - show create button */
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-primary/30 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Skapa bokning
          </button>
        )}
      </section>

      {/* Booking Modal */}
      {showModal &&
        createPortal(
          <BookingModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            existingBooking={
              hasBooking
                ? {
                    date: new Date(currentSamtal.bookedDate!),
                    duration: currentSamtal.duration || 60,
                    location: currentSamtal.metadata.location,
                    meetingLink: currentSamtal.metadata.meetingLink,
                  }
                : undefined
            }
            onSave={(date, duration, location, meetingLink) => {
              setBooking(date, duration, location, meetingLink)
              setShowModal(false)
            }}
            onRemove={hasBooking ? removeBooking : undefined}
          />,
          document.body
        )}

      {/* Remove Confirmation Modal */}
      {showRemoveConfirm &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
            <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-sm mx-4">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  Ta bort bokning?
                </h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">
                  Är du säker på att du vill ta bort bokningen? Datum, tid och
                  plats kommer att rensas.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
                <button
                  onClick={() => setShowRemoveConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleRemoveBooking}
                  className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                >
                  Ta bort
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

/* Booking Modal Component */
interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  existingBooking?: {
    date: Date
    duration: number
    location?: string
    meetingLink?: string
  }
  onSave: (date: Date, duration: number, location?: string, meetingLink?: string) => void
  onRemove?: () => void
}

// Duration options: every 15 min up to 4 hours
const DURATION_OPTIONS = [
  { value: 15, label: '15 minuter' },
  { value: 30, label: '30 minuter' },
  { value: 45, label: '45 minuter' },
  { value: 60, label: '60 minuter' },
  { value: 75, label: '1 timme 15 min' },
  { value: 90, label: '1 timme 30 min' },
  { value: 105, label: '1 timme 45 min' },
  { value: 120, label: '2 timmar' },
  { value: 135, label: '2 timmar 15 min' },
  { value: 150, label: '2 timmar 30 min' },
  { value: 165, label: '2 timmar 45 min' },
  { value: 180, label: '3 timmar' },
  { value: 195, label: '3 timmar 15 min' },
  { value: 210, label: '3 timmar 30 min' },
  { value: 225, label: '3 timmar 45 min' },
  { value: 240, label: '4 timmar' },
]

export function BookingModal({
  isOpen,
  onClose,
  existingBooking,
  onSave,
  onRemove,
}: BookingModalProps) {
  // Initialize form state
  const [date, setDate] = useState(() => {
    if (existingBooking?.date) {
      return existingBooking.date.toISOString().split('T')[0]
    }
    return new Date().toISOString().split('T')[0]
  })

  const [time, setTime] = useState(() => {
    if (existingBooking?.date) {
      return existingBooking.date.toTimeString().slice(0, 5)
    }
    return '09:00'
  })

  const [duration, setDuration] = useState(existingBooking?.duration || 60)
  const [location, setLocation] = useState(existingBooking?.location || '')
  const [meetingLink, setMeetingLink] = useState(
    existingBooking?.meetingLink || ''
  )

  // Track which optional fields are shown
  const [showLocation, setShowLocation] = useState(!!existingBooking?.location)
  const [showMeetingLink, setShowMeetingLink] = useState(
    !!existingBooking?.meetingLink
  )

  const handleSave = () => {
    const dateTime = new Date(`${date}T${time}:00`)
    onSave(
      dateTime,
      duration,
      location.trim() || undefined,
      meetingLink.trim() || undefined
    )
  }

  const isEditing = !!existingBooking

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            {isEditing ? 'Redigera bokning' : 'Skapa bokning'}
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Datum
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Time & Duration Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Tid
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Längd
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                }}
              >
                {DURATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location - Click to add pattern */}
          {showLocation ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Plats
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="t.ex. Konferensrum A"
                autoFocus
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowLocation(true)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Lägg till plats</span>
            </button>
          )}

          {/* Meeting Link - Click to add pattern */}
          {showMeetingLink ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Video className="w-4 h-4 text-muted-foreground" />
                Möteslänk
              </label>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://teams.microsoft.com/..."
                autoFocus
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowMeetingLink(true)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              <Video className="w-4 h-4" />
              <span>Lägg till möteslänk</span>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          {/* Remove button - only show when editing */}
          {isEditing && onRemove ? (
            <button
              onClick={() => {
                onRemove()
                onClose()
              }}
              className="px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              Ta bort bokning
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Avbryt
            </button>
            <button
              onClick={handleSave}
              disabled={!date || !time}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Spara ändringar' : 'Skapa bokning'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
