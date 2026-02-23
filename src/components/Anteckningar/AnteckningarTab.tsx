import { useState } from 'react'
import { useStore } from '../../store/useStore'
import AgendaEditor from './AgendaEditor'
import AISummary from './AISummary'
import MeetingContent from '../shared/MeetingContent'
import TaskItem from '../UppgifterMal/TaskItem'
import MarkAsKlarModal from '@/components/modals/MarkAsKlarModal'

export default function AnteckningarTab() {
  const {
    currentStatus,
    editorMode,
    currentSamtal,
    setEditorMode,
    hasUnsavedChanges,
    isEditingNotes,
    lastSaved,
    saveNotes,
    setIsEditingNotes,
    timerActive,
    timerTotalSeconds,
    timerStartedAt,
    timerMode,
    timerCountdownSeconds,
    startTimer,
    pauseTimer,
    resetTimer,
    timerAlwaysVisible,
    timerStyle,
    hideTimerBar,
    setTimerStyle,
  } = useStore()

  const [showMarkAsKlarModal, setShowMarkAsKlarModal] = useState(false)

  const handleSend = () => {
    console.log('Send notes')
  }

  const handleDownloadPDF = () => {
    console.log('Download PDF')
  }

  const handleSave = () => {
    saveNotes()
  }

  const handleToggleEdit = () => {
    setIsEditingNotes(!isEditingNotes)
  }

  // Determine if editor should be read-only
  const isReadOnly = currentStatus === 'klar' && !isEditingNotes

  return (
    <div>
      {/* Main Card */}
      <div className="min-h-[600px]" data-tour="detail-editor">
        <MeetingContent
          participants={currentSamtal.participants}
          status={currentStatus}
          activeTab={editorMode === 'agenda' ? 'notes' : 'recap'}
          onTabChange={(tab) => setEditorMode(tab === 'notes' ? 'agenda' : 'ai-summary')}
          notesContent={<AgendaEditor initialContent={currentSamtal.notes} readOnly={isReadOnly} conversationId={currentSamtal.id} />}
          recapContent={<div className="p-6"><AISummary /></div>}
          onSend={handleSend}
          onDownload={handleDownloadPDF}
          hasUnsavedChanges={hasUnsavedChanges}
          onSave={handleSave}
          isEditingNotes={isEditingNotes}
          onToggleEdit={handleToggleEdit}
          lastSaved={lastSaved}
          onMarkAsKlar={() => setShowMarkAsKlarModal(true)}
          timerActive={timerActive}
          timerTotalSeconds={timerTotalSeconds}
          timerStartedAt={timerStartedAt}
          onStartTimer={startTimer}
          onPauseTimer={pauseTimer}
          onResetTimer={resetTimer}
          timerAlwaysVisible={timerAlwaysVisible}
          timerStyle={timerStyle}
          timerMode={timerMode}
          timerCountdownSeconds={timerCountdownSeconds}
          onHideTimer={hideTimerBar}
          onSetTimerStyle={setTimerStyle}
        />
      </div>

      {/* Mark as Klar Modal */}
      <MarkAsKlarModal
        isOpen={showMarkAsKlarModal}
        onClose={() => setShowMarkAsKlarModal(false)}
      />
    </div>
  )
}
