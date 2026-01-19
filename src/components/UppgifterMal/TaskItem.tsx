/**
 * TaskItem Component
 *
 * Displays individual task or goal with status, owner, deadline, and actions
 */

import { useStore } from '@/store/useStore'
import { Target, Circle, CheckCircle2, User, Calendar } from 'lucide-react'
import { useState, useRef } from 'react'
import confetti from 'canvas-confetti'
import type { Task, GoalStatus } from '@/types'

interface TaskItemProps {
  task: Task
  showOrigin?: boolean
}

export default function TaskItem({ task, showOrigin = false }: TaskItemProps) {
  const { updateTask, openTaskModal } = useStore()
  const [isCompletingAnimation, setIsCompletingAnimation] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'Klar'
      case 'in_progress':
      case 'pending':
        return 'Ej klar'
    }
  }

  const getGoalStatusLabel = (goalStatus: GoalStatus) => {
    switch (goalStatus) {
      case 'ligger_efter':
        return 'Ligger efter'
      case 'gar_enligt_plan':
        return 'Går enligt plan'
      case 'uppnatt':
        return 'Uppnått'
      default:
        return null
    }
  }

  const getGoalStatusColor = (goalStatus: GoalStatus): string => {
    switch (goalStatus) {
      case 'ligger_efter':
        return 'bg-amber-500'
      case 'gar_enligt_plan':
        return 'bg-teal-500'
      case 'uppnatt':
        return 'bg-green-500'
      default:
        return 'bg-gray-300'
    }
  }

  const getGoalStatusTextColor = (goalStatus: GoalStatus): string => {
    switch (goalStatus) {
      case 'ligger_efter':
        return 'text-amber-600'
      case 'gar_enligt_plan':
        return 'text-teal-600'
      case 'uppnatt':
        return 'text-green-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const triggerConfetti = () => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight

    // Fire confetti from the checkbox position
    confetti({
      particleCount: 35,
      spread: 80,
      origin: { x, y },
      colors: ['#FFD700', '#FFC0CB', '#9370DB', '#22c55e', '#10b981'],
      scalar: 0.8,
      gravity: 0.8,
      drift: 0.2,
      ticks: 150,
      startVelocity: 20
    })
  }

  const handleStatusChange = (e: React.MouseEvent) => {
    // Stop event from bubbling up to parent div's onClick
    e.stopPropagation()

    // Toggle between pending and completed (skip in_progress)
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'

    if (newStatus === 'completed') {
      // Immediately show green state
      setIsCompletingAnimation(true)

      // Fire confetti after a tiny delay for the green to show
      setTimeout(() => {
        triggerConfetti()
      }, 100)

      // Update the actual status after animation plays
      setTimeout(() => {
        updateTask(task.id, { status: newStatus })
        setIsCompletingAnimation(false)
      }, 1200)
    } else {
      // When uncompleting, update immediately
      updateTask(task.id, { status: newStatus })
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'short'
    })
  }

  const handleEdit = (e: React.MouseEvent) => {
    // Prevent triggering if clicking on the checkbox
    if ((e.target as HTMLElement).closest('button[data-checkbox]')) {
      return
    }
    openTaskModal(task.type, task, 'tab')
  }

  // Goal card design (with left border based on status)
  if (task.type === 'goal') {
    const borderColor = getGoalStatusColor(task.goalStatus ?? null)
    const statusLabel = getGoalStatusLabel(task.goalStatus ?? null)
    const statusTextColor = getGoalStatusTextColor(task.goalStatus ?? null)

    return (
      <div
        onClick={handleEdit}
        className="group relative bg-card border border-border rounded-md hover:shadow-sm transition-shadow cursor-pointer"
      >
        {/* Left border - color based on goalStatus */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderColor} rounded-l-md`} />

        <div className="ml-2 px-3 py-2.5">
          {/* Title row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Target className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-base font-medium text-foreground truncate">
                {task.title}
              </span>
              {statusLabel && (
                <span className={`text-sm ${statusTextColor} flex-shrink-0`}>
                  • {statusLabel}
                </span>
              )}
            </div>

            {/* Right side - compact info */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-shrink-0">
              {task.assignee && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span className="hidden sm:inline">{task.assignee.name.split(' ')[0]}</span>
                </div>
              )}
              {task.due && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(task.due)}</span>
                </div>
              )}
            </div>
          </div>
          {/* Description row */}
          {task.description && (
            <p className="mt-1 ml-6 text-xs text-muted-foreground truncate">
              {task.description}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Task card design (with circle checkbox) - compact
  const isCompleted = task.status === 'completed'
  const showAsCompleted = isCompleted || isCompletingAnimation

  return (
    <div
      onClick={handleEdit}
      className={`group relative rounded-md transition-all duration-300 overflow-hidden cursor-pointer ${
        showAsCompleted
          ? 'bg-green-50 border border-green-200 scale-[1.01]'
          : 'bg-card border border-border hover:shadow-sm'
      }`}
    >
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          {/* Checkbox */}
          <button
            ref={buttonRef}
            data-checkbox
            onClick={handleStatusChange}
            className="flex-shrink-0 transition-transform hover:scale-110 active:scale-95"
          >
            {showAsCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 transition-all duration-200" />
            ) : (
              <Circle className="w-4 h-4 text-border hover:text-primary transition-all duration-200" />
            )}
          </button>

          {/* Content - single row */}
          <div className="flex items-center justify-between gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className={`text-base font-medium truncate transition-all duration-300 ${showAsCompleted ? 'text-green-700 line-through' : 'text-foreground'}`}>
                {task.title}
              </span>
              <span className={`text-sm flex-shrink-0 transition-all duration-300 ${showAsCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                • {showAsCompleted ? 'Klar' : getStatusLabel(task.status)}
              </span>
            </div>

            {/* Right side - compact info */}
            <div className={`flex items-center gap-3 text-sm flex-shrink-0 transition-all duration-300 ${showAsCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
              {task.assignee && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span className="hidden sm:inline">{task.assignee.name.split(' ')[0]}</span>
                </div>
              )}
              {task.due && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(task.due)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Description row */}
        {task.description && (
          <p className={`mt-1 ml-6 text-xs truncate transition-all duration-300 ${showAsCompleted ? 'text-green-600 line-through' : 'text-muted-foreground'}`}>
            {task.description}
          </p>
        )}
      </div>
    </div>
  )
}
