import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Calendar, Clock, Sparkles } from 'lucide-react'
import { HistoricalMeeting } from '../../types'
import MeetingContent from '../shared/MeetingContent'
import { useStore } from '../../store/useStore'
import TaskItem from '../UppgifterMal/TaskItem'
import AgendaEditor from '../Anteckningar/AgendaEditor'

interface HistoricalMeetingModalProps {
  meeting: HistoricalMeeting
  onClose: () => void
}

export default function HistoricalMeetingModal({ meeting, onClose }: HistoricalMeetingModalProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'recap'>('recap')
  const { allTasks } = useStore()

  const meetingGoals = allTasks.filter(
    t => t.origin?.conversationId === meeting.id && t.type === 'goal'
  )

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('sv-SE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (date: Date, duration: number) => {
    const start = date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
    const endTime = new Date(date.getTime() + duration * 60000)
    const end = endTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
    return `${start} - ${end}`
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-card w-full max-w-4xl max-h-[85vh] rounded-xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-foreground">{meeting.title}</h2>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(meeting.date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTime(meeting.date, meeting.duration || 60)}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <MeetingContent
            participants={meeting.participants}
            status={meeting.status}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            notesContent={
              <div className="p-6 bg-white">
                <div className="max-w-3xl mx-auto w-full">
                  <AgendaEditor
                    initialContent={meeting.agendaContent}
                    readOnly={true}
                  />
                </div>
              </div>
            }
            recapContent={
              <div className="p-6 bg-white">
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* AI Summary View */}
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      AI Sammanfattning
                    </h3>
                    <p className="text-foreground/80 leading-relaxed">
                      {meeting.aiSummary?.overview || 'Ingen sammanfattning tillgänglig.'}
                    </p>
                  </div>

                  {meeting.aiSummary?.keyDiscussions && (
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Nyckeldiskussioner
                      </h4>
                      <ul className="space-y-2">
                        {meeting.aiSummary.keyDiscussions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-foreground">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {meeting.aiSummary?.managerNotes && (
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Mina anteckningar
                      </h4>
                      <ul className="space-y-2">
                        {meeting.aiSummary.managerNotes.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-foreground">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
