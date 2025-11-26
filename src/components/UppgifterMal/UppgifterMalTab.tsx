import { useState, useMemo } from 'react'
import { useStore } from '@/store/useStore'
import { ChevronDown, ChevronRight } from 'lucide-react'
import TaskItem from './TaskItem'

type FilterType = 'all' | 'tasks' | 'goals'

export default function UppgifterMalTab() {
  const { tasks, currentSamtal } = useStore()
  const [filter, setFilter] = useState<FilterType>('all')
  const [expandedSections, setExpandedSections] = useState({
    nya: true,
    pagaende: false,
    avslutade: false,
  })

  // Get the participant (not the manager/Ansvarig) from the current conversation
  const currentParticipant = useMemo(() => {
    return currentSamtal.participants.find(p => p.roleInSamtal === 'Deltagare')
  }, [currentSamtal.participants])

  const toggleSection = (section: 'nya' | 'pagaende' | 'avslutade') => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const filterTasks = (taskList: any[]) => {
    if (filter === 'all') return taskList
    if (filter === 'tasks') return taskList.filter(t => t.type === 'task')
    if (filter === 'goals') return taskList.filter(t => t.type === 'goal')
    return taskList
  }

  // Filter tasks to only show those assigned to the current participant
  const participantTasks = useMemo(() => {
    if (!currentParticipant) return tasks
    return tasks.filter(task => task.assignee?.id === currentParticipant.id)
  }, [tasks, currentParticipant])

  // Categorize tasks based on origin and status
  // New tasks: created in current conversation AND not completed
  const newTasks = useMemo(
    () => filterTasks(participantTasks.filter((task) =>
      task.origin?.conversationId === currentSamtal.id && task.status !== 'completed'
    )),
    [participantTasks, currentSamtal.id, filter]
  )

  // Ongoing tasks: from previous conversations AND not completed
  const ongoingTasks = useMemo(
    () => filterTasks(
      participantTasks.filter(
        (task) =>
          task.origin?.conversationId !== currentSamtal.id && task.status !== 'completed'
      )
    ),
    [participantTasks, currentSamtal.id, filter]
  )

  // Completed tasks: all completed regardless of origin
  const completedTasks = useMemo(
    () => filterTasks(participantTasks.filter((task) => task.status === 'completed')),
    [participantTasks, filter]
  )

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border border-border p-4">
        {/* Filter Controls */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Alla
          </button>
          <button
            onClick={() => setFilter('tasks')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === 'tasks'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            ✓ Uppgifter
          </button>
          <button
            onClick={() => setFilter('goals')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === 'goals'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            🎯 Mål
          </button>
        </div>

        <div className="space-y-4">
          {/* Nya Section */}
          <div>
            <button
              onClick={() => toggleSection('nya')}
              className="w-full flex items-center gap-2 py-2 hover:opacity-80 transition-opacity"
            >
              {expandedSections.nya ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              <h3 className="text-base font-semibold">Nya</h3>
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {newTasks.length}
              </span>
            </button>
            {expandedSections.nya && (
              <div className="mt-2 space-y-2">
                {newTasks.length > 0 ? (
                  newTasks.map((task) => (
                    <TaskItem key={task.id} task={task} showOrigin={false} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm py-2">
                    {filter === 'all' ? 'Inga nya uppgifter eller mål än.' :
                     filter === 'tasks' ? 'Inga nya uppgifter än.' :
                     'Inga nya mål än.'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Pågående Section */}
          <div>
            <button
              onClick={() => toggleSection('pagaende')}
              className="w-full flex items-center gap-2 py-2 hover:opacity-80 transition-opacity"
            >
              {expandedSections.pagaende ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              <h3 className="text-base font-semibold">Pågående</h3>
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {ongoingTasks.length}
              </span>
            </button>
            {expandedSections.pagaende && (
              <div className="mt-2 space-y-2">
                {ongoingTasks.length > 0 ? (
                  ongoingTasks.map((task) => (
                    <TaskItem key={task.id} task={task} showOrigin={true} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm py-2">Inga pågående uppgifter eller mål.</p>
                )}
              </div>
            )}
          </div>

          {/* Avslutade Section */}
          <div>
            <button
              onClick={() => toggleSection('avslutade')}
              className="w-full flex items-center gap-2 py-2 hover:opacity-80 transition-opacity"
            >
              {expandedSections.avslutade ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              <h3 className="text-base font-semibold">Avslutade</h3>
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {completedTasks.length}
              </span>
            </button>
            {expandedSections.avslutade && (
              <div className="mt-2 space-y-2 opacity-70">
                {completedTasks.length > 0 ? (
                  completedTasks.map((task) => (
                    <TaskItem key={task.id} task={task} showOrigin={true} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm py-2">Inga avslutade uppgifter eller mål.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
