/**
 * SlashPlugin - Adds slash command support to the editor
 *
 * Features:
 * - Type "/" to open command palette
 * - Quick insert blocks: headings, lists, tables, etc.
 * - Disabled in code blocks
 */

import { createPlatePlugin } from '@udecode/plate'
import { SlashInputElement } from '../ui/SlashInputElement'

export interface SlashMenuItem {
  key: string
  title: string
  description: string
  icon?: string
  group: string
  onSelect: (editor: any) => void
}

export const SlashPlugin = createPlatePlugin({
  key: 'slashCommand',
  handlers: {
    onKeyDown: ({ editor, event }) => {
      // Trigger slash menu on "/"
      if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
        const { selection } = editor
        if (!selection) return

        // Don't trigger in code blocks
        const [node] = editor.node(selection) || []
        if (node && (node.type === 'code_block' || node.type === 'code')) {
          return
        }

        // Let the default "/" character be inserted
        // The SlashInputElement will detect it and show the menu
      }
    },
  },
})

/**
 * Slash menu items configuration
 */
export const getSlashMenuItems = (editor: any): SlashMenuItem[] => [
  // Basic blocks
  {
    key: 'text',
    title: 'Text',
    description: 'Start writing plain text',
    icon: '¶',
    group: 'Basic Blocks',
    onSelect: () => {
      insertBlock(editor, { type: 'p' })
    },
  },
  {
    key: 'h1',
    title: 'Heading 1',
    description: 'Large section heading',
    icon: 'H1',
    group: 'Basic Blocks',
    onSelect: () => {
      insertBlock(editor, { type: 'h1' })
    },
  },
  {
    key: 'h2',
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: 'H2',
    group: 'Basic Blocks',
    onSelect: () => {
      insertBlock(editor, { type: 'h2' })
    },
  },
  {
    key: 'h3',
    title: 'Heading 3',
    description: 'Small section heading',
    icon: 'H3',
    group: 'Basic Blocks',
    onSelect: () => {
      insertBlock(editor, { type: 'h3' })
    },
  },
  {
    key: 'bulleted-list',
    title: 'Bulleted List',
    description: 'Create a bulleted list',
    icon: '•',
    group: 'Basic Blocks',
    onSelect: () => {
      insertBlock(editor, { type: 'ul' })
    },
  },
  {
    key: 'numbered-list',
    title: 'Numbered List',
    description: 'Create a numbered list',
    icon: '1.',
    group: 'Basic Blocks',
    onSelect: () => {
      insertBlock(editor, { type: 'ol' })
    },
  },
  {
    key: 'code-block',
    title: 'Code Block',
    description: 'Insert a code block',
    icon: '</>',
    group: 'Basic Blocks',
    onSelect: () => {
      insertBlock(editor, { type: 'code_block' })
    },
  },
  {
    key: 'table',
    title: 'Table',
    description: 'Insert a table',
    icon: '⊞',
    group: 'Basic Blocks',
    onSelect: () => {
      // Insert a 2x2 table
      editor.tf.insert.table({ rowCount: 2, colCount: 2 })
    },
  },
  {
    key: 'blockquote',
    title: 'Blockquote',
    description: 'Insert a quote block',
    icon: '"',
    group: 'Basic Blocks',
    onSelect: () => {
      insertBlock(editor, { type: 'blockquote' })
    },
  },

  // Task management
  {
    key: 'task',
    title: 'Uppgift',
    description: 'Skapa en ny uppgift',
    icon: '☐',
    group: 'Uppgifter & Mål',
    onSelect: () => {
      // Open task modal
      const { openTaskModal } = require('@/store/useStore').useStore.getState()
      openTaskModal('task')
    },
  },
  {
    key: 'goal',
    title: 'Mål',
    description: 'Skapa ett nytt mål',
    icon: '◎',
    group: 'Uppgifter & Mål',
    onSelect: () => {
      // Open goal modal
      const { openTaskModal } = require('@/store/useStore').useStore.getState()
      openTaskModal('goal')
    },
  },
]

/**
 * Transform to insert a block at the current selection
 */
export function insertBlock(editor: any, blockData: { type: string }) {
  if (!editor || !editor.selection) return

  // Get current block
  const [currentNode, currentPath] = editor.node(editor.selection) || []

  if (!currentNode || !currentPath) return

  // If current block is empty, transform it
  const text = editor.string(currentPath)
  if (!text || text.trim() === '' || text === '/') {
    editor.setNodes(
      { type: blockData.type },
      { at: currentPath }
    )
    // Clear the slash character if present
    if (text === '/') {
      editor.delete({ at: currentPath })
    }
  } else {
    // Insert new block after current one
    const nextPath = [currentPath[0] + 1]
    editor.insertNodes(
      { type: blockData.type, children: [{ text: '' }] },
      { at: nextPath }
    )
    // Move selection to new block
    editor.select(nextPath)
  }

  // Focus editor
  editor.focus()
}
