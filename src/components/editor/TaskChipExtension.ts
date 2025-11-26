/**
 * TipTap Extension for Task Chips
 * Renders inline task/goal chips as custom nodes
 */

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import TaskChipNodeView from './TaskChipNodeView'

export interface TaskChipOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    taskChip: {
      setTaskChip: (options: { taskId: string; title: string; type: 'task' | 'goal' }) => ReturnType
    }
  }
}

export const TaskChip = Node.create<TaskChipOptions>({
  name: 'taskChip',

  group: 'inline',
  inline: true,

  atom: true,

  addAttributes() {
    return {
      taskId: {
        default: null,
        parseHTML: element => element.getAttribute('data-task-id'),
        renderHTML: attributes => ({
          'data-task-id': attributes.taskId,
        }),
      },
      title: {
        default: '',
        parseHTML: element => element.getAttribute('data-title'),
        renderHTML: attributes => ({
          'data-title': attributes.title,
        }),
      },
      chipType: {
        default: 'task',
        parseHTML: element => element.getAttribute('data-type'),
        renderHTML: attributes => ({
          'data-type': attributes.chipType,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-task-chip]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const isGoal = HTMLAttributes['data-type'] === 'goal'
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-task-chip': '',
        class: `task-chip task-chip-${HTMLAttributes['data-type']}`,
        contenteditable: 'false',
      }),
      ['span', {}, isGoal ? '🎯' : '○'],
      ' ',
      ['span', {}, HTMLAttributes['data-title']],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(TaskChipNodeView)
  },

  addCommands() {
    return {
      setTaskChip:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              taskId: options.taskId,
              title: options.title,
              chipType: options.type,
            },
          })
        },
    }
  },
})
