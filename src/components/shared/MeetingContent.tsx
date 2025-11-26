import { useState } from 'react'
import { FileText, Sparkles, Share2, MoreVertical, FileDown, Send } from 'lucide-react'
import ParticipantAvatar from './ParticipantAvatar'
import { Participant, User } from '../../types'

interface MeetingContentProps {
  participants: (Participant | User)[]
  status: 'planerad' | 'ej_bokad' | 'bokad' | 'klar' | 'completed' | 'ongoing' | 'cancelled'
  activeTab: 'notes' | 'recap'
  onTabChange: (tab: 'notes' | 'recap') => void
  notesContent: React.ReactNode
  recapContent: React.ReactNode
  onSend?: () => void
  onDownload?: () => void
}

export default function MeetingContent({
  participants,
  status,
  activeTab,
  onTabChange,
  notesContent,
  recapContent,
  onSend,
  onDownload
}: MeetingContentProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const isCompleted = status === 'klar' || status === 'completed'

  return (
    <div className="bg-card rounded-lg border border-border flex flex-col">
      {/* Header with avatars, segmented control, and actions */}
      <div className="border-b border-border bg-card flex-shrink-0">
        {/* Row 1: Avatars and Actions */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Participant avatars */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {participants.map((participant) => (
                <div key={participant.id} className="relative z-0 hover:z-10 transition-all">
                  <ParticipantAvatar participant={participant} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
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
            <div className="flex gap-1 p-1 bg-muted rounded-lg w-full">
              <button
                onClick={() => onTabChange('recap')}
                className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'recap'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Sammanfattning</span>
              </button>
              <button
                onClick={() => onTabChange('notes')}
                className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'notes'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
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
    </div>
  )
}
