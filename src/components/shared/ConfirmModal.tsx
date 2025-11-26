/**
 * ConfirmModal Component
 *
 * Generic reusable confirmation dialog for critical actions
 */

import { useEffect } from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'default' | 'destructive'
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Bekräfta',
  cancelText = 'Avbryt',
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmModalProps) {
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      return () => window.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const confirmButtonClass =
    variant === 'destructive'
      ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
      : 'bg-primary text-primary-foreground hover:bg-primary/90'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2
          id="modal-title"
          className="text-xl font-semibold text-foreground mb-3"
        >
          {title}
        </h2>

        {/* Message */}
        <p className="text-muted-foreground mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            autoFocus
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
