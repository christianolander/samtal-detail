/**
 * React NodeView for AI Block
 * Renders AI-generated content that mimics actual editor styling
 * with discrete approve/reject controls
 */

import { NodeViewWrapper } from '@tiptap/react'
import { useState } from 'react'
import {
  Sparkles,
  Check,
  X,
  Pencil,
} from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function AIBlockNodeView({ node, editor, deleteNode, getPos }: any) {
  const { addTask, currentSamtal } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(node.attrs.content)

  const title = node.attrs.title
  const content = node.attrs.content
  const goals = node.attrs.goals || []
  const tasks = node.attrs.tasks || []

  const handleApprove = () => {
    // Get the position of this AI block
    const pos = getPos()
    if (typeof pos !== 'number') return

    const finalContent = isEditing ? editedContent : content
    const nodeSize = node.nodeSize

    // Create goals in store with origin linking to current samtal
    if (goals && goals.length > 0) {
      goals.forEach((goal: any) => {
        addTask({
          type: 'goal',
          title: goal.title,
          description: goal.description || '',
          status: 'pending',
          assignee: undefined,
          origin: {
            conversationId: currentSamtal.id,
            conversationTitle: currentSamtal.name,
          },
        })
      })
    }

    // Create tasks in store with origin linking to current samtal
    if (tasks && tasks.length > 0) {
      tasks.forEach((task: any) => {
        addTask({
          type: 'task',
          title: task.title,
          status: 'pending',
          assignee: task.assignee ? { id: 'user', name: task.assignee, role: 'employee' } : undefined,
          origin: {
            conversationId: currentSamtal.id,
            conversationTitle: currentSamtal.name,
          },
        })
      })
    }

    // Delete the AI block first
    editor.chain()
      .deleteRange({ from: pos, to: pos + nodeSize })
      .run()

    // Insert content at the position
    editor.commands.insertContentAt(pos, finalContent)

    // Insert goals as TaskChips
    if (goals && goals.length > 0) {
      goals.forEach((goal: any) => {
        editor.commands.setTaskChip({
          taskId: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: goal.title,
          type: 'goal',
        })
      })
    }

    // Insert tasks as TaskChips
    if (tasks && tasks.length > 0) {
      tasks.forEach((task: any) => {
        editor.commands.setTaskChip({
          taskId: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: task.title,
          type: 'task',
        })
      })
    }
  }

  const handleReject = () => {
    deleteNode()
  }

  const handleSaveEdit = () => {
    setIsEditing(false)
  }

  return (
    <NodeViewWrapper className="ai-block-wrapper my-3" contentEditable={false}>
      <div className="ai-block-card relative border-l-[3px] border-dashed border-[#7e22ce]/60 bg-[#7e22ce]/[0.04] rounded-r-lg pl-4 pr-3 py-3 transition-all hover:bg-[#7e22ce]/[0.07] hover:border-[#7e22ce]/80 group">
        {/* Top bar: AI label (left) + Controls (right) */}
        <div className="flex items-center justify-between mb-2">
          {/* AI suggestion label - very small */}
          <div className="flex items-center gap-1 text-[10px] text-[#7e22ce]/70 font-medium uppercase tracking-wider">
            <Sparkles className="w-2.5 h-2.5" />
            <span>AI-förslag</span>
          </div>

          {/* Discrete controls - top right */}
          {!isEditing && (
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleApprove}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-[#7e22ce] hover:bg-[#7e22ce]/10 rounded transition-colors"
                title="Godkänn"
              >
                <Check className="w-3 h-3" />
                <span>Godkänn</span>
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                title="Redigera"
              >
                <Pencil className="w-3 h-3" />
                <span>Redigera</span>
              </button>
              <button
                onClick={handleReject}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                title="Avvisa"
              >
                <X className="w-3 h-3" />
                <span>Avvisa</span>
              </button>
            </div>
          )}
        </div>

        {/* Content - styled to match editor */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-32 p-3 text-sm bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#7e22ce]/50"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1.5 bg-[#7e22ce] text-white rounded-md text-xs font-medium hover:bg-[#7e22ce]/90 transition-colors"
              >
                Spara
              </button>
              <button
                onClick={() => {
                  setEditedContent(content)
                  setIsEditing(false)
                }}
                className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Avbryt
              </button>
            </div>
          </div>
        ) : (
          <div className="ai-block-content">
            {/* Title - styled as h2 like in editor */}
            {title && (
              <h2 className="text-xl font-semibold text-foreground mb-2 leading-tight">
                {title}
              </h2>
            )}

            {/* Content - mimics tiptap prose styling */}
            <div
              className="ai-block-prose text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Goals as inline chips */}
            {goals && goals.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {goals.map((goal: any) => (
                  <span
                    key={goal.id}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 text-sm font-medium bg-teal-500/10 text-teal-700 rounded border-l-[3px] border-teal-500"
                  >
                    <span>🎯</span>
                    {goal.title}
                  </span>
                ))}
              </div>
            )}

            {/* Tasks as inline chips */}
            {tasks && tasks.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tasks.map((task: any) => (
                  <span
                    key={task.id}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 text-sm font-medium bg-blue-500/10 text-blue-700 rounded border-l-[3px] border-blue-500"
                  >
                    <span className="w-3 h-3 rounded-full border-2 border-blue-500 flex-shrink-0" />
                    {task.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}
