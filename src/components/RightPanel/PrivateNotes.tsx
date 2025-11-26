/**
 * PrivateNotes Component
 *
 * Displays list of private manager notes with expandable items
 * Modal for creating new notes
 */

import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Clock, ChevronRight, X } from 'lucide-react'
import type { PrivateNote } from '@/types'

export default function PrivateNotes() {
  const { privateNotes, addPrivateNote } = useStore()
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState('')

  const handleCreateNote = () => {
    if (newNoteContent.trim()) {
      addPrivateNote(newNoteContent.trim())
      setNewNoteContent('')
      setShowModal(false)
    }
  }

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      <div className="space-y-2">
        {/* Header with + Ny button */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-2 px-3 text-sm font-medium text-primary border border-dashed border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
          >
            + Ny anteckning
          </button>
        </div>

        {/* Notes List */}
        {privateNotes.length > 0 ? (
          <div className="space-y-2">
            {privateNotes.map((note) => {
              const isExpanded = expandedNoteId === note.id

              return (
                <div
                  key={note.id}
                  className="border border-border rounded-lg overflow-hidden bg-card hover:border-primary/20 transition-colors"
                >
                  {/* Note Header - Always visible */}
                  <button
                    onClick={() =>
                      setExpandedNoteId(isExpanded ? null : note.id)
                    }
                    className="w-full flex items-center justify-between p-3 hover:bg-accent/50 transition-colors"
                  >
                    {/* Date and preview */}
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(note.timestamp)}</span>
                      </div>
                      {!isExpanded && (
                        <div className="text-sm text-foreground line-clamp-1">
                          {note.content}
                        </div>
                      )}
                    </div>

                    {/* Expand chevron */}
                    <ChevronRight
                      className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ml-2 ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-0">
                      <div className="text-sm text-foreground whitespace-pre-wrap">
                        {note.content}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground text-center py-8 border border-dashed border-border rounded-lg">
            Inga privata anteckningar ännu
          </div>
        )}
      </div>

      {/* Modal for creating new note */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Ny privat anteckning
              </h3>
              <button
                onClick={() => {
                  setShowModal(false)
                  setNewNoteContent('')
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-4">
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Skriv din privata anteckning här..."
                className="w-full min-h-[150px] p-3 text-sm border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                autoFocus
              />
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
              <button
                onClick={() => {
                  setShowModal(false)
                  setNewNoteContent('')
                }}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={handleCreateNote}
                disabled={!newNoteContent.trim()}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Skapa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
