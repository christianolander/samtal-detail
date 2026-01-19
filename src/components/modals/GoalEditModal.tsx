/**
 * GoalEditModal - Modal for editing goals
 *
 * Structure:
 * 1. Status card at top with "Ändra status" button (slides to status update view)
 * 2. Collapsible "Visa historik" section
 * 3. Same form fields as Create modal (Title, Description, Due date, Follow-up frequency, Owner)
 *
 * Two views with slide animation:
 * - Details View (default): status card + history + form fields
 * - Status Update View: current status + new status dropdown + comment
 */

import { useState, useMemo } from 'react'
import { useStore } from '@/store/useStore'
import {
  X,
  Target,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Star,
  User as UserIcon,
  ArrowLeft,
  Info,
} from 'lucide-react'
import type { Task, GoalStatus, FollowUpFrequency } from '@/types'

interface GoalEditModalProps {
  goal: Task
  onClose: () => void
}

type ViewMode = 'details' | 'status'

export default function GoalEditModal({ goal: initialGoal, onClose }: GoalEditModalProps) {
  const { updateTask, addGoalStatusUpdate, currentSamtal, tasks } = useStore()

  // Get the latest goal data from the store (for updated status/history)
  const goal = useMemo(() => {
    return tasks.find(t => t.id === initialGoal.id) ?? initialGoal
  }, [tasks, initialGoal.id])

  // View state for slide animation
  const [currentView, setCurrentView] = useState<ViewMode>('details')

  // Form state (same fields as Create modal)
  const [title, setTitle] = useState(goal.title)
  const [description, setDescription] = useState(goal.description || '')
  const [dueDate, setDueDate] = useState(goal.due ? new Date(goal.due).toISOString().split('T')[0] : '')
  const [followUpFrequency, setFollowUpFrequency] = useState<FollowUpFrequency>(goal.followUpFrequency ?? null)
  const [assigneeId, setAssigneeId] = useState(goal.assignee?.id || '')

  // History visibility
  const [historyExpanded, setHistoryExpanded] = useState(false)

  // Status update view state
  const [newStatus, setNewStatus] = useState<GoalStatus>(goal.goalStatus ?? null)
  const [statusComment, setStatusComment] = useState('')

  // Get current participant for owner dropdown
  const currentParticipant = useMemo(() => {
    return currentSamtal.participants.find(p => p.roleInSamtal === 'Deltagare')
  }, [currentSamtal.participants])

  // Get status badge styling
  const getStatusConfig = (status: GoalStatus) => {
    switch (status) {
      case 'gar_enligt_plan':
        return {
          label: 'Går enligt plan',
          icon: CheckCircle2,
          colors: 'bg-green-100 text-green-700 border-green-200',
          iconColor: 'text-green-600',
        }
      case 'ligger_efter':
        return {
          label: 'Ligger efter',
          icon: AlertCircle,
          colors: 'bg-amber-100 text-amber-700 border-amber-200',
          iconColor: 'text-amber-600',
        }
      case 'uppnatt':
        return {
          label: 'Uppnått',
          icon: Star,
          colors: 'bg-blue-100 text-blue-700 border-blue-200',
          iconColor: 'text-blue-600',
        }
      default:
        return {
          label: 'Ingen status',
          icon: Clock,
          colors: 'bg-gray-100 text-gray-600 border-gray-200',
          iconColor: 'text-gray-500',
        }
    }
  }

  // Format relative time for history
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)

    if (months > 0) return `för ${months} ${months === 1 ? 'månad' : 'månader'} sedan`
    if (weeks > 0) return `för ${weeks} ${weeks === 1 ? 'vecka' : 'veckor'} sedan`
    if (days > 0) return `för ${days} ${days === 1 ? 'dag' : 'dagar'} sedan`
    return 'idag'
  }

  // Save details (form fields)
  const handleSaveDetails = () => {
    const selectedParticipant = currentSamtal.participants.find(p => p.id === assigneeId)
    const isManager = selectedParticipant?.roleInSamtal === 'Ansvarig'

    updateTask(goal.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      due: dueDate ? new Date(dueDate) : undefined,
      followUpFrequency: followUpFrequency,
      assignee: selectedParticipant ? {
        id: selectedParticipant.id,
        name: selectedParticipant.name,
        role: isManager ? 'manager' : 'employee',
      } as Task['assignee'] : undefined,
    })
    onClose()
  }

  // Save status update - go back to details view, don't close modal
  const handleSaveStatus = () => {
    const statusToSave = newStatus ?? goal.goalStatus
    addGoalStatusUpdate(goal.id, statusToSave, statusComment.trim() || undefined)

    // Go back to details view and reset form
    setCurrentView('details')
    setStatusComment('')
    // Reset newStatus to the saved status (will be reflected in goal after store updates)
    setNewStatus(statusToSave)
  }

  // Cancel status update - go back to details view
  const handleCancelStatus = () => {
    setCurrentView('details')
    setStatusComment('')
    setNewStatus(goal.goalStatus ?? null)
  }

  const currentStatusConfig = getStatusConfig(goal.goalStatus ?? null)
  const CurrentStatusIcon = currentStatusConfig.icon

  // Always allow saving - user can update with same status or add a comment
  const canSaveStatus = true

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            {currentView === 'status' && (
              <button
                onClick={() => setCurrentView('details')}
                className="text-muted-foreground hover:text-foreground transition-colors -ml-2 mr-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {currentView === 'details' ? 'Redigera mål' : 'Uppdatera status'}
              </h2>
              <p className="text-sm text-muted-foreground truncate max-w-md">
                {currentView === 'details' ? goal.title : 'Lägg till statusuppdatering'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content with slide animation - different height per view */}
        <div
          className="flex-1 overflow-hidden relative transition-all duration-300"
          style={{ minHeight: currentView === 'details' ? '620px' : '320px' }}
        >
          {/* Details View */}
          <div
            className={`absolute inset-0 transition-transform duration-300 ease-in-out overflow-y-auto ${
              currentView === 'details' ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="p-6 space-y-4">
              {/* Status Card with History inside */}
              <div className="bg-muted/30 border border-border rounded-lg">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">Nuvarande status:</span>
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${currentStatusConfig.colors}`}
                    >
                      <CurrentStatusIcon className={`w-4 h-4 ${currentStatusConfig.iconColor}`} />
                      {currentStatusConfig.label}
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentView('status')}
                    className="px-3 py-1.5 text-sm font-medium bg-muted hover:bg-muted/80 text-foreground rounded-md transition-colors"
                  >
                    Ändra status
                  </button>
                </div>

                {/* History Section (Collapsible) - Inside the card */}
                {goal.statusHistory && goal.statusHistory.length > 0 && (
                  <>
                    <div>
                      <button
                        onClick={() => setHistoryExpanded(!historyExpanded)}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/30 transition-colors"
                      >
                        {historyExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        Visa historik ({goal.statusHistory.length} uppföljningar)
                      </button>
                    </div>

                    {historyExpanded && (
                      <div className="px-4 pb-4 space-y-4 pl-8 border-t border-border pt-4">
                        {goal.statusHistory.map((update, index) => {
                          const isLast = index === goal.statusHistory!.length - 1
                          const updateConfig = getStatusConfig(update.status)
                          const UpdateIcon = updateConfig.icon

                          return (
                            <div key={update.id} className="relative">
                              {!isLast && (
                                <div className="absolute left-2.5 top-8 w-0.5 h-[calc(100%+1rem)] bg-border" />
                              )}

                              <div className="flex gap-3">
                                <div
                                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 ${updateConfig.colors}`}
                                >
                                  <UpdateIcon className="w-3 h-3" />
                                </div>

                                <div className="flex-1 pb-4">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-sm font-medium ${updateConfig.colors.split(' ')[1]}`}>
                                      {updateConfig.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatRelativeTime(update.timestamp)}
                                    </span>
                                  </div>

                                  {update.comment && (
                                    <p className="text-sm text-foreground/80 mb-2">{update.comment}</p>
                                  )}

                                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <UserIcon className="w-3 h-3" />
                                    <span>{update.user.name}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Form Fields (same as Create modal) */}
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Titel *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="T.ex. Bli Senior Developer"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Beskrivning
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Frivillig beskrivning..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  När ska målet vara uppfyllt? (valfritt)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Follow-up Frequency */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                  Uppföljningsfrekvens
                  <span className="relative group">
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-foreground text-background rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Hur ofta ska målet följas upp?
                    </span>
                  </span>
                </label>
                <select
                  value={followUpFrequency ?? ''}
                  onChange={(e) => setFollowUpFrequency(e.target.value === '' ? null : e.target.value as FollowUpFrequency)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-teal-500"
                >
                  <option value="">Välj frekvens...</option>
                  <option value="varje_vecka">Varje vecka</option>
                  <option value="varannan_vecka">Varannan vecka</option>
                  <option value="varje_manad">Varje månad</option>
                  <option value="varje_kvartal">Varje kvartal</option>
                </select>
              </div>

              {/* Owner */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ägare
                </label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-teal-500"
                >
                  {currentSamtal.participants.map((participant) => (
                    <option key={participant.id} value={participant.id}>
                      {participant.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Status Update View */}
          <div
            className={`absolute inset-0 transition-transform duration-300 ease-in-out overflow-y-auto ${
              currentView === 'status' ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-6 space-y-4">
              {/* Status Dropdown - pre-selected with current status */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <select
                  value={newStatus ?? goal.goalStatus ?? ''}
                  onChange={(e) => setNewStatus(e.target.value as GoalStatus)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-teal-500"
                >
                  <option value="gar_enligt_plan">Går enligt plan</option>
                  <option value="ligger_efter">Ligger efter</option>
                  <option value="uppnatt">Uppnått</option>
                </select>
              </div>

              {/* Comment Textarea */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Kommentar (valfritt)
                </label>
                <textarea
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  placeholder="Beskriv framsteg, utmaningar eller nästa steg..."
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border flex-shrink-0">
          <button
            type="button"
            onClick={currentView === 'details' ? onClose : handleCancelStatus}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Avbryt
          </button>
          {currentView === 'details' ? (
            <button
              onClick={handleSaveDetails}
              disabled={!title.trim()}
              className="px-4 py-2 text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Spara ändringar
            </button>
          ) : (
            <button
              onClick={handleSaveStatus}
              disabled={!canSaveStatus}
              className="px-4 py-2 text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Spara status
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
