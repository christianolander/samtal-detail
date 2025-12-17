/**
 * TipTap Extension for AI-Generated Content Blocks
 * Renders block-level AI suggestions with approve/reject/edit actions
 */

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import AIBlockNodeView from './AIBlockNodeView'

export interface AIBlockOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    aiBlock: {
      setAIBlock: (options: {
        blockId: string
        title: string
        content: string
        goals?: { id: string; title: string; description?: string }[]
        tasks?: { id: string; title: string; assignee?: string }[]
      }) => ReturnType
      removeAIBlock: (blockId: string) => ReturnType
      approveAIBlock: (blockId: string) => ReturnType
    }
  }
}

export const AIBlock = Node.create<AIBlockOptions>({
  name: 'aiBlock',

  group: 'block',

  content: 'block*',

  defining: true,

  addAttributes() {
    return {
      blockId: {
        default: null,
        parseHTML: element => element.getAttribute('data-block-id'),
        renderHTML: attributes => ({
          'data-block-id': attributes.blockId,
        }),
      },
      title: {
        default: '',
        parseHTML: element => element.getAttribute('data-title'),
        renderHTML: attributes => ({
          'data-title': attributes.title,
        }),
      },
      content: {
        default: '',
        parseHTML: element => element.getAttribute('data-content'),
        renderHTML: attributes => ({
          'data-content': attributes.content,
        }),
      },
      goals: {
        default: [],
        parseHTML: element => {
          const goalsAttr = element.getAttribute('data-goals')
          return goalsAttr ? JSON.parse(goalsAttr) : []
        },
        renderHTML: attributes => ({
          'data-goals': JSON.stringify(attributes.goals || []),
        }),
      },
      tasks: {
        default: [],
        parseHTML: element => {
          const tasksAttr = element.getAttribute('data-tasks')
          return tasksAttr ? JSON.parse(tasksAttr) : []
        },
        renderHTML: attributes => ({
          'data-tasks': JSON.stringify(attributes.tasks || []),
        }),
      },
      status: {
        default: 'pending',
        parseHTML: element => element.getAttribute('data-status'),
        renderHTML: attributes => ({
          'data-status': attributes.status,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-ai-block]',
        getAttrs: (element: HTMLElement) => {
          let goals = []
          let tasks = []
          let content = ''

          try {
            const goalsAttr = element.getAttribute('data-goals')
            if (goalsAttr) {
              goals = JSON.parse(decodeURIComponent(goalsAttr))
            }
          } catch (e) {
            console.warn('Failed to parse goals:', e)
          }

          try {
            const tasksAttr = element.getAttribute('data-tasks')
            if (tasksAttr) {
              tasks = JSON.parse(decodeURIComponent(tasksAttr))
            }
          } catch (e) {
            console.warn('Failed to parse tasks:', e)
          }

          try {
            const contentAttr = element.getAttribute('data-content')
            if (contentAttr) {
              content = decodeURIComponent(contentAttr)
            }
          } catch (e) {
            console.warn('Failed to parse content:', e)
          }

          return {
            blockId: element.getAttribute('data-block-id'),
            title: element.getAttribute('data-title') || '',
            content,
            goals,
            tasks,
            status: element.getAttribute('data-status') || 'pending',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-ai-block': '',
        class: 'ai-block',
      }),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(AIBlockNodeView)
  },

  addCommands() {
    return {
      setAIBlock:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              blockId: options.blockId,
              title: options.title,
              content: options.content,
              goals: options.goals || [],
              tasks: options.tasks || [],
              status: 'pending',
            },
          })
        },
      removeAIBlock:
        blockId =>
        ({ state, dispatch }) => {
          const { tr, doc } = state
          let found = false

          doc.descendants((node, pos) => {
            if (node.type.name === 'aiBlock' && node.attrs.blockId === blockId) {
              if (dispatch) {
                tr.delete(pos, pos + node.nodeSize)
              }
              found = true
              return false
            }
            return true
          })

          if (found && dispatch) {
            dispatch(tr)
          }
          return found
        },
      approveAIBlock:
        blockId =>
        ({ state, dispatch, commands }) => {
          const { doc } = state
          let blockNode: any = null
          let blockPos = -1

          doc.descendants((node, pos) => {
            if (node.type.name === 'aiBlock' && node.attrs.blockId === blockId) {
              blockNode = node
              blockPos = pos
              return false
            }
            return true
          })

          if (!blockNode || blockPos === -1) return false

          // Get the block attributes
          const { title, content, goals, tasks } = blockNode.attrs

          // Delete the AI block
          commands.removeAIBlock(blockId)

          // Insert the approved content
          // First insert heading
          commands.insertContent({
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: title }],
          })

          // Insert the HTML content
          commands.insertContent(content)

          // Insert goals as TaskChips
          if (goals && goals.length > 0) {
            commands.insertContent({
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Mål:', marks: [{ type: 'bold' }] },
              ],
            })
            goals.forEach((goal: any) => {
              commands.setTaskChip({
                taskId: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: goal.title,
                type: 'goal',
              })
            })
          }

          // Insert tasks as TaskChips
          if (tasks && tasks.length > 0) {
            commands.insertContent({
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Uppgifter:', marks: [{ type: 'bold' }] },
              ],
            })
            tasks.forEach((task: any) => {
              commands.setTaskChip({
                taskId: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: task.title,
                type: 'task',
              })
            })
          }

          return true
        },
    }
  },
})
