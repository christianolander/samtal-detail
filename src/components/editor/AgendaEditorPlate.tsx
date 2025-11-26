/**
 * AgendaEditorPlate - Main Plate-based rich text editor
 *
 * Supports:
 * - Rich text formatting (bold, italic, headings, lists, etc.)
 * - Task and goal chips with inline creation
 * - Slash commands for quick insertions
 * - Template mode with placeholder text
 * - Fixed and floating toolbars
 */

import { useEffect } from 'react'
import { Plate, usePlateEditor } from '@udecode/plate'
import { useStore } from '@/store/useStore'
import { EditorKit } from './editor-kit'
import { FixedToolbar } from './ui/FixedToolbar'
import { FloatingToolbar } from './ui/FloatingToolbar'
import { SlashInputElement } from './ui/SlashInputElement'

// Initial editor content
const initialValue = [
  {
    id: '1',
    type: 'h1',
    children: [{ text: '💰 Lönesamtal' }],
  },
  {
    id: '2',
    type: 'p',
    children: [{ text: 'Skriv dina anteckningar här...' }],
  },
]

export default function AgendaEditorPlate() {
  const { editorContent, setEditorContent } = useStore()

  // Parse stored content or use initial value
  const value = editorContent
    ? tryParseJSON(editorContent, initialValue)
    : initialValue

  const editor = usePlateEditor({
    plugins: EditorKit,
    value,
  })

  // Save content on change
  useEffect(() => {
    if (!editor) return

    const handleChange = () => {
      const content = JSON.stringify(editor.children)
      setEditorContent(content)
    }

    // Debounce saves
    const timer = setTimeout(handleChange, 1000)
    return () => clearTimeout(timer)
  }, [editor?.children, setEditorContent])

  // Register editor globally for task chip insertion
  useEffect(() => {
    if (editor) {
      useStore.setState({ plateEditor: editor })
    }
  }, [editor])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey

      // Cmd/Ctrl+Shift+G: Create goal
      if (isMod && e.shiftKey && e.key === 'G') {
        e.preventDefault()
        useStore.getState().openTaskModal('goal')
      }

      // Cmd/Ctrl+Shift+T: Create task
      if (isMod && e.shiftKey && e.key === 'T') {
        e.preventDefault()
        useStore.getState().openTaskModal('task')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <Plate editor={editor}>
      <div className="flex flex-col h-full">
        {/* Fixed Toolbar */}
        <FixedToolbar />

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div
              className="prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[400px]"
              data-plate-editor="true"
            >
              {/* Editor will be rendered here by Plate */}
            </div>
          </div>
        </div>

        {/* Floating Toolbar */}
        <FloatingToolbar />

        {/* Slash Command Palette */}
        <SlashInputElement />
      </div>
    </Plate>
  )
}

// Helper to safely parse JSON
function tryParseJSON(jsonString: string, fallback: any) {
  try {
    return JSON.parse(jsonString)
  } catch {
    return fallback
  }
}
