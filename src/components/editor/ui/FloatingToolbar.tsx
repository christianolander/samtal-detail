/**
 * FloatingToolbar - Appears above selected text
 *
 * Provides quick access to text formatting options
 */

import { useEditorRef, useEditorSelector } from '@udecode/plate'
import { Bold, Italic, Underline, Strikethrough, Code } from 'lucide-react'

export function FloatingToolbar() {
  const editor = useEditorRef()

  // Check if there's a selection
  const hasSelection = useEditorSelector(
    (editor) => {
      if (!editor.selection) return false
      const [start, end] = [editor.selection.anchor, editor.selection.focus]
      return start.path.join(',') !== end.path.join(',') || start.offset !== end.offset
    },
    []
  )

  if (!hasSelection) return null

  return (
    <div className="fixed z-50 bg-card border border-border rounded-lg shadow-lg p-1 flex items-center gap-1">
      <ToolbarButton onClick={() => editor?.tf.toggle.mark({ key: 'bold' })}>
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor?.tf.toggle.mark({ key: 'italic' })}>
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor?.tf.toggle.mark({ key: 'underline' })}>
        <Underline className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor?.tf.toggle.mark({ key: 'strikethrough' })}>
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor?.tf.toggle.mark({ key: 'code' })}>
        <Code className="w-4 h-4" />
      </ToolbarButton>
    </div>
  )
}

function ToolbarButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
    >
      {children}
    </button>
  )
}
