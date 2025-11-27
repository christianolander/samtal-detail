import { useStore } from '../../store/useStore'
import TimerBar from './TimerBar'
import AgendaEditor from './AgendaEditor'
import AISummary from './AISummary'
import MeetingContent from '../shared/MeetingContent'
import TaskItem from '../UppgifterMal/TaskItem'

export default function AnteckningarTab() {
  const { currentStatus, editorMode, currentSamtal, setEditorMode, tasks } = useStore()

  const handleSend = () => {
    console.log('Send notes')
  }

  const handleDownloadPDF = () => {
    console.log('Download PDF')
  }

  return (
    <div className="space-y-4">
      {/* Timer Bar - Draggable with smart sticky, visible when Bokad */}
      {currentStatus === 'bokad' && (
        <div className="flex justify-center pb-4">
          <TimerBar />
        </div>
      )}

      {/* Main Card */}
      <div className="min-h-[600px]">
        <MeetingContent
          participants={currentSamtal.participants}
          status={currentStatus}
          activeTab={editorMode === 'agenda' ? 'notes' : 'recap'}
          onTabChange={(tab) => setEditorMode(tab === 'notes' ? 'agenda' : 'ai-summary')}
          notesContent={<AgendaEditor initialContent={currentSamtal.notes} />}
          recapContent={<div className="p-6"><AISummary /></div>}
          onSend={handleSend}
          onDownload={handleDownloadPDF}
        />
      </div>
    </div>
  )
}
