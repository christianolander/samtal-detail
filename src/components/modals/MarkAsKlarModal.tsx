/**
 * MarkAsKlarModal Component
 *
 * Confirmation modal for marking a samtal as complete.
 * Includes success state with confetti animation.
 */

import { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { CheckCircle2, Send, PartyPopper } from 'lucide-react'

interface MarkAsKlarModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MarkAsKlarModal({ isOpen, onClose }: MarkAsKlarModalProps) {
  const { setStatus, stopTimer } = useStore()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([])

  const handleConfirm = () => {
    stopTimer()
    setStatus('klar')

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

  const handleSuccessClose = () => {
    setShowSuccessModal(false)
    onClose()
  }

  if (!isOpen) return null

  // Show success modal after confirmation
  if (showSuccessModal) {
    return (
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
              Vi skickar nu anteckningar och sammanfattning till alla deltagare via e-post.
            </p>

            <button
              onClick={handleSuccessClose}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors"
            >
              Stäng
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show confirmation modal
  return (
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
                Bekräfta att samtalet är genomfört och dokumenterat
              </p>
            </div>
          </div>

          {/* Main explanation */}
          <p className="text-sm text-foreground mb-5 leading-relaxed">
            När du markerar samtalet som klart kommer en automatisk sammanfattning att skapas och skickas till alla deltagare.
          </p>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-3 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Avbryt
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-5 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Markera som klar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
