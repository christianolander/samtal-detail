/**
 * TaskModal - Modal for creating and editing tasks/goals
 *
 * Collects:
 * - Type (task or goal)
 * - Title
 * - Description
 * - Status
 * - Due date
 * - Assignee
 * - Goal Status (for goals only)
 */

import { useState, useEffect, useMemo } from 'react'
import { useStore } from '@/store/useStore'
import { X, Target, CheckSquare, User, Calendar, Info } from 'lucide-react'
import type { Task, GoalStatus, FollowUpFrequency } from '@/types'

export default function TaskModal() {
  const {
    taskModalOpen,
    taskModalType,
    taskModalTask,
    closeTaskModal,
    addTaskWithChip,
    updateTask,
    currentSamtal,
  } = useStore()

  // Get the participant (Deltagare) from current conversation
  const currentParticipant = useMemo(() => {
    return currentSamtal.participants.find(p => p.roleInSamtal === 'Deltagare')
  }, [currentSamtal.participants])

  // Get the manager (Ansvarig) from current conversation
  const currentManager = useMemo(() => {
    return currentSamtal.participants.find(p => p.roleInSamtal === 'Ansvarig')
  }, [currentSamtal.participants])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<Task['status']>('pending')
  const [dueDate, setDueDate] = useState('')
  const [assigneeId, setAssigneeId] = useState<string>('') // Will be set from participant
  const [goalStatus, setGoalStatus] = useState<GoalStatus>(null)
  const [followUpFrequency, setFollowUpFrequency] = useState<FollowUpFrequency>(null)

  const isEditing = !!taskModalTask?.id

  // Populate form when editing or reset for new
  useEffect(() => {
    if (taskModalTask) {
      setTitle(taskModalTask.title || '')
      setDescription(taskModalTask.description || '')
      setStatus(taskModalTask.status || 'pending')
      setDueDate(taskModalTask.due ? new Date(taskModalTask.due).toISOString().split('T')[0] : '')
      setAssigneeId(taskModalTask.assignee?.id || currentParticipant?.id || '')
      setGoalStatus(taskModalTask.goalStatus ?? null)
      setFollowUpFrequency(taskModalTask.followUpFrequency ?? null)
    } else {
      // Reset form - default assignee to current participant
      setTitle('')
      setDescription('')
      setStatus('pending')
      setDueDate('')
      setAssigneeId(currentParticipant?.id || '')
      setGoalStatus(null)
      setFollowUpFrequency(null)
    }
  }, [taskModalTask, taskModalOpen, currentParticipant])

  if (!taskModalOpen || !taskModalType) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    // Find the selected participant from the current samtal
    const selectedParticipant = currentSamtal.participants.find(p => p.id === assigneeId)
    const isManager = selectedParticipant?.roleInSamtal === 'Ansvarig'

    const taskData = {
      type: taskModalType,
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      due: dueDate ? new Date(dueDate) : undefined,
      assignee: selectedParticipant ? {
        id: selectedParticipant.id,
        name: selectedParticipant.name,
        role: isManager ? 'manager' : 'employee',
      } as Task['assignee'] : undefined,
      goalStatus: taskModalType === 'goal' ? goalStatus : undefined,
      followUpFrequency: taskModalType === 'goal' ? followUpFrequency : undefined,
    }

    if (isEditing && taskModalTask) {
      // Update existing task
      updateTask(taskModalTask.id, taskData)
    } else {
      // Create new task with chip
      addTaskWithChip(taskData)
    }

    closeTaskModal()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            {taskModalType === 'goal' ? (
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <CheckSquare className="w-5 h-5" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {isEditing ? 'Redigera' : 'Skapa'} {taskModalType === 'goal' ? 'mål' : 'uppgift'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {taskModalType === 'goal'
                  ? 'Definiera ett långsiktigt utvecklingsmål'
                  : 'Skapa en konkret uppgift att genomföra'}
              </p>
            </div>
          </div>
          <button
            onClick={closeTaskModal}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Titel *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                taskModalType === 'goal'
                  ? 'T.ex. Bli Senior Developer'
                  : 'T.ex. Genomför löneöversyn'
              }
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
              required
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
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Due Date - Different label for goals vs tasks */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {taskModalType === 'goal'
                ? 'När ska målet vara uppfyllt? (valfritt)'
                : 'Deadline (valfritt)'}
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Follow-up Frequency - Goals only */}
          {taskModalType === 'goal' && (
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
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Välj frekvens...</option>
                <option value="varje_vecka">Varje vecka</option>
                <option value="varannan_vecka">Varannan vecka</option>
                <option value="varje_manad">Varje månad</option>
                <option value="varje_kvartal">Varje kvartal</option>
              </select>
            </div>
          )}

          {/* Goal Status - Goals only */}
          {taskModalType === 'goal' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={goalStatus ?? ''}
                onChange={(e) => setGoalStatus(e.target.value === '' ? null : e.target.value as GoalStatus)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Välj status...</option>
                <option value="ej_paborjad">Ej påbörjad</option>
                <option value="ligger_efter">Ligger efter</option>
                <option value="gar_enligt_plan">Går enligt plan</option>
                <option value="uppnatt">Uppnått</option>
              </select>
            </div>
          )}

          {/* Task Status - Tasks only (simple done/not done) */}
          {taskModalType === 'task' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={status === 'completed' ? 'completed' : 'pending'}
                onChange={(e) => setStatus(e.target.value as Task['status'])}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="pending">Ej klar</option>
                <option value="completed">Klar</option>
              </select>
            </div>
          )}

          {/* Ägare (Owner/Assignee) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Ägare
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {currentSamtal.participants.map((participant) => (
                <option key={participant.id} value={participant.id}>
                  {participant.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={closeTaskModal}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                taskModalType === 'goal'
                  ? 'bg-teal-600 hover:bg-teal-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isEditing ? 'Uppdatera' : 'Skapa'} {taskModalType === 'goal' ? 'mål' : 'uppgift'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
