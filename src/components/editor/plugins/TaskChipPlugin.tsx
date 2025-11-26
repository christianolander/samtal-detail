/**
 * TaskChipPlugin - Adds task/goal chip support to the editor
 *
 * Features:
 * - Registers 'taskChip' as an inline void element
 * - Provides insertTaskChip transform
 * - Renders chips using TaskChipElement
 */

import { createPlatePlugin } from '@udecode/plate'
import { TaskChipElement } from '../ui/TaskChipElement'

export interface TaskChipNode {
  type: 'taskChip'
  taskId: string
  title: string
  chipType: 'task' | 'goal'
  children: [{ text: '' }]
}

export const TaskChipPlugin = createPlatePlugin({
  key: 'taskChip',
  node: {
    isElement: true,
    isInline: true,
    isVoid: true,
    component: TaskChipElement as any,
  },
})

/**
 * Transform to insert a task chip at the current selection
 */
export function insertTaskChip(
  editor: any,
  data: {
    taskId: string
    title: string
    type: 'task' | 'goal'
  }
) {
  if (!editor) return

  const chipNode: TaskChipNode = {
    type: 'taskChip',
    taskId: data.taskId,
    title: data.title,
    chipType: data.type,
    children: [{ text: '' }],
  }

  // Insert at current selection or at end of document
  if (editor.selection) {
    editor.insertNodes(chipNode)
    // Add a space after the chip
    editor.insertText(' ')
  } else {
    // Insert at end of document
    const lastPath = [editor.children.length - 1]
    editor.insertNodes(chipNode, { at: lastPath })
  }

  // Focus editor
  editor.focus()
}
