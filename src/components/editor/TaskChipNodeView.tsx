/**
 * React NodeView for Task Chip
 * Renders full-width goal/task cards with metadata
 */

import { NodeViewWrapper } from '@tiptap/react'
import { useStore } from '@/store/useStore'
import { User, Circle, CheckCircle2, Calendar } from 'lucide-react'
import type { Task, GoalStatus } from '@/types'

export default function TaskChipNodeView({ node }: any) {
  const { allTasks, openTaskModal, updateTask } = useStore()

  const taskId = node.attrs.taskId
  const title = node.attrs.title
  const chipType = node.attrs.chipType

  // Find the actual task
  const task = allTasks.find((t) => t.id === taskId)

  const handleClick = () => {
    if (task) {
      openTaskModal(task.type, task)
    }
  }

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening modal when clicking checkbox
    if (task) {
      // Toggle directly between pending and completed (skip in_progress)
      const newStatus = task.status === 'completed' ? 'pending' : 'completed'
      updateTask(task.id, { status: newStatus })
    }
  }

  const isGoal = chipType === 'goal'

  // Goal status color helpers
  const getGoalStatusBorderColor = (goalStatus: GoalStatus): string => {
    switch (goalStatus) {
      case 'ej_paborjad': return 'bg-gray-400'
      case 'ligger_efter': return 'bg-amber-500'
      case 'gar_enligt_plan': return 'bg-teal-500'
      case 'uppnatt': return 'bg-green-500'
      default: return 'bg-gray-300'
    }
  }

  // Get status display for goals
  const getStatusDisplay = (goalStatus: GoalStatus) => {
    switch (goalStatus) {
      case 'ej_paborjad':
        return { emoji: '⏸️', text: 'Ej påbörjad' }
      case 'ligger_efter':
        return { emoji: '⚠️', text: 'Ligger efter' }
      case 'gar_enligt_plan':
        return { emoji: '💪', text: 'Enligt plan' }
      case 'uppnatt':
        return { emoji: '🏁', text: 'Uppnått' }
      default:
        return { emoji: '⏸️', text: 'Ej påbörjad' }
    }
  }

  // Get status label for tasks
  const getTaskStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'Klart'
      case 'in_progress':
        return 'Pågår'
      case 'pending':
        return 'Ej klar'
    }
  }

  const goalStatusValue = isGoal && task ? (task.goalStatus ?? null) : null
  const goalStatusDisplay = isGoal && task ? getStatusDisplay(goalStatusValue) : null
  const goalBorderColor = isGoal ? getGoalStatusBorderColor(goalStatusValue) : ''
  const taskStatus = !isGoal && task ? task.status : null

  // Format date for display
  const formatDate = (date?: Date) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'short'
    })
  }

  const taskDeadline = !isGoal && task?.due ? formatDate(task.due) : null

  return (
    <NodeViewWrapper className="block my-3" contentEditable={false}>
      <div
        onClick={handleClick}
        className="task-chip-card group cursor-pointer bg-muted/30 hover:bg-muted/50 border border-border rounded-lg transition-all hover:shadow-sm relative overflow-hidden"
      >
        {/* Left color panel - only for goals, color based on status */}
        {isGoal && (
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${goalBorderColor}`} />
        )}

        <div className={`${isGoal ? 'pl-4' : 'pl-3'} pr-4 py-2.5`}>
          {/* Line 1: Icon + Title */}
          <div className="flex items-center gap-2 mb-1">
            {isGoal ? (
              <span className="text-base flex-shrink-0">🎯</span>
            ) : (
              <button
                onClick={handleCheckboxClick}
                className="flex-shrink-0 transition-colors"
              >
                {task?.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <Circle className="w-4 h-4 text-border hover:text-primary" />
                )}
              </button>
            )}
            <h4 className="font-semibold text-foreground text-base leading-tight flex-1">
              {title}
            </h4>
          </div>

          {/* Line 2: Owner (left) + Status/Deadline (right) */}
          {task && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              {/* Owner */}
              {task.assignee && (
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3" />
                  <span>{task.assignee.name}</span>
                </div>
              )}

              {/* Goal status or Task deadline */}
              {isGoal && goalStatusDisplay && (
                <div className="flex items-center gap-1.5">
                  <span>{goalStatusDisplay.emoji}</span>
                  <span>{goalStatusDisplay.text}</span>
                </div>
              )}
              {!isGoal && taskDeadline && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  <span>{taskDeadline}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  )
}
