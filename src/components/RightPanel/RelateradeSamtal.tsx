import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { mockHistoricalMeetings } from '../../lib/mockData'
import { Calendar, Clock, ChevronRight, FileText } from 'lucide-react'
import { HistoricalMeeting } from '../../types'
import HistoricalMeetingModal from '../modals/HistoricalMeetingModal'

export default function RelateradeSamtal() {
  const { currentSamtal } = useStore()
  const [selectedMeeting, setSelectedMeeting] = useState<HistoricalMeeting | null>(null)

  // Filter meetings where:
  // 1. At least one participant matches (excluding manager if needed, but simple overlap is fine)
  // 2. The meeting type matches the current conversation type
  const relatedMeetings = mockHistoricalMeetings.filter(meeting => 
    meeting.type === currentSamtal.type &&
    meeting.participants.some(p => 
      currentSamtal.participants.some(cp => cp.id === p.id)
    )
  )

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div>
        <h3 className="text-sm font-medium text-foreground mb-1">Tidigare samtal</h3>
        <p className="text-xs text-muted-foreground">
          Historik för {currentSamtal.participants.find(p => p.roleInSamtal === 'Medarbetare')?.name || 'medarbetaren'}
        </p>
      </div>

      <div className="space-y-3">
        {relatedMeetings.length > 0 ? (
          relatedMeetings.map((meeting) => (
            <button
              key={meeting.id}
              onClick={() => setSelectedMeeting(meeting)}
              className="w-full flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-all text-left group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-medium text-foreground truncate pr-2">
                    {meeting.title}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(meeting.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{meeting.duration} min</span>
                  </div>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-lg">
            Inga tidigare samtal hittades
          </div>
        )}
      </div>

      {selectedMeeting && (
        <HistoricalMeetingModal 
          meeting={selectedMeeting} 
          onClose={() => setSelectedMeeting(null)} 
        />
      )}
    </div>
  )
}
