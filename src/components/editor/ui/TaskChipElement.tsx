/**
 * TaskChipElement - Renders condensed inline task/goal chips in the editor
 *
 * Design: Minimal inline chip with hover tooltip for details
 * Features:
 * - Compact inline design that flows with text
 * - Left border indicator for goals
 * - Hover reveals full details in tooltip
 * - Click to open full task modal
 */

import { useStore } from '@/store/useStore'
import { Target, Circle, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import type { GoalStatus } from '@/types'

interface TaskChipElementProps {
  attributes: any
  children: React.ReactNode
  element: {
    type: 'taskChip'
    taskId: string
    title: string
    chipType: 'task' | 'goal'
  }
}

// Goal status color helpers
const getGoalStatusBorderColor = (goalStatus: GoalStatus): string => {
  switch (goalStatus) {
    case 'ligger_efter': return 'border-amber-500'
    case 'gar_enligt_plan': return 'border-teal-500'
    case 'uppnatt': return 'border-green-500'
    default: return 'border-gray-300'
  }
}

const getGoalStatusBgColor = (goalStatus: GoalStatus): string => {
  switch (goalStatus) {
    case 'ligger_efter': return 'bg-amber-50/80 hover:bg-amber-100'
    case 'gar_enligt_plan': return 'bg-teal-50/80 hover:bg-teal-100'
    case 'uppnatt': return 'bg-green-50/80 hover:bg-green-100'
    default: return 'bg-gray-50/80 hover:bg-gray-100'
  }
}

const getGoalStatusTextColor = (goalStatus: GoalStatus): string => {
  switch (goalStatus) {
    case 'ligger_efter': return 'text-amber-900'
    case 'gar_enligt_plan': return 'text-teal-900'
    case 'uppnatt': return 'text-green-900'
    default: return 'text-gray-700'
  }
}

const getGoalStatusLabel = (goalStatus: GoalStatus): string | null => {
  switch (goalStatus) {
    case 'ligger_efter': return 'Ligger efter'
    case 'gar_enligt_plan': return 'Enligt plan'
    case 'uppnatt': return 'Uppnått'
    default: return null
  }
}

export function TaskChipElement({ attributes, children, element }: TaskChipElementProps) {
  const { tasks, updateTask, openTaskModal } = useStore()
  const [isHovered, setIsHovered] = useState(false)

  // Find the actual task/goal
  const task = tasks.find((t) => t.id === element.taskId)

  if (!task) {
    // Task was deleted
    return (
      <span {...attributes} contentEditable={false}>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted/50 text-muted-foreground text-xs border border-border">
          <span className="opacity-50">[Borttagen {element.chipType === 'goal' ? 'mål' : 'uppgift'}]</span>
        </span>
        {children}
      </span>
    )
  }

  const isGoal = task.type === 'goal'
  const goalStatus = task.goalStatus ?? null
  const goalStatusLabel = isGoal ? getGoalStatusLabel(goalStatus) : null

  const handleClick = () => {
    openTaskModal(task.type, task)
  }

  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (task.type === 'task') {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed'
      updateTask(task.id, { status: newStatus })
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'short',
    })
  }

  // Build tooltip content
  const tooltipLines = []
  if (task.assignee) tooltipLines.push(`Ansvarig: ${task.assignee.name}`)
  if (task.due) tooltipLines.push(`Deadline: ${formatDate(task.due)}`)
  if (task.description) tooltipLines.push(task.description)

  return (
    <span {...attributes} contentEditable={false} className="relative inline-block">
      <span
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md
          cursor-pointer transition-all duration-200
          border-l-[3px] text-base font-medium hover:shadow-sm
          ${
            isGoal
              ? `${getGoalStatusBorderColor(goalStatus)} ${getGoalStatusBgColor(goalStatus)} ${getGoalStatusTextColor(goalStatus)}`
              : task.status === 'completed'
              ? 'border-green-500 bg-green-50/80 text-green-900 hover:bg-green-100 line-through opacity-75'
              : 'border-blue-500 bg-blue-50/80 text-blue-900 hover:bg-blue-100'
          }
        `}
      >
        {/* Icon */}
        {isGoal ? (
          <Target className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.5} />
        ) : (
          <button
            onClick={handleToggleStatus}
            className="flex items-center flex-shrink-0 -ml-0.5"
            title={task.status === 'completed' ? 'Markera som ej klar' : 'Markera som klar'}
          >
            {task.status === 'completed' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" strokeWidth={2.5} />
            ) : (
              <Circle className="w-3.5 h-3.5" strokeWidth={2} />
            )}
          </button>
        )}

        {/* Title */}
        <span className="leading-tight">{task.title}</span>

        {/* Goal status label */}
        {isGoal && goalStatusLabel && (
          <span className="text-xs opacity-75">• {goalStatusLabel}</span>
        )}

        {/* Status indicator (small dot) */}
        {!isGoal && task.status === 'in_progress' && (
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" title="Pågår" />
        )}
      </span>

      {/* Tooltip on hover */}
      {isHovered && tooltipLines.length > 0 && (
        <span className="absolute left-0 top-full mt-1 z-50 min-w-[200px] max-w-[300px] px-3 py-2 text-xs bg-popover border border-border rounded-lg shadow-lg pointer-events-none">
          {tooltipLines.map((line, i) => (
            <div key={i} className="text-popover-foreground whitespace-pre-wrap">
              {line}
            </div>
          ))}
        </span>
      )}

      {children}
    </span>
  )
}
