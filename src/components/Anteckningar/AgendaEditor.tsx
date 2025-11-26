import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { useStore } from '@/store/useStore'
import { TaskChip } from '../editor/TaskChipExtension'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Target,
  CheckSquare,
  ImageIcon,
} from 'lucide-react'

interface AgendaEditorProps {
  initialContent?: string
  readOnly?: boolean
}

export default function AgendaEditor({ initialContent, readOnly = false }: AgendaEditorProps) {
  const { editorContent, setEditorContent, rightPanelCollapsed } = useStore()
  const openTaskModal = useStore((state) => state.openTaskModal)

  // Load content from localStorage on mount (for persistence across sessions)
  const getInitialContent = () => {
    // For read-only mode (historical meetings), always use the provided initialContent
    if (readOnly) {
      return initialContent || '<p>Inga anteckningar tillgängliga.</p>'
    }

    // Priority: 1. Stored content from store (includes localStorage), 2. initialContent prop, 3. default template
    const storedContent = editorContent || localStorage.getItem('samtal-editor-content')
    if (storedContent && storedContent.trim()) {
      return storedContent
    }
    if (initialContent && initialContent.trim()) {
      return initialContent
    }
    return '<h1>💰 Lönesamtal</h1><p>Skriv dina anteckningar här...</p>'
  }

  const editor = useEditor({
    editable: !readOnly,
    extensions: [
      StarterKit,
      TaskChip,
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: 'w-full rounded-lg h-auto mb-8',
        },
      }),
    ],
    content: getInitialContent(),
    onUpdate: ({ editor }) => {
      if (!readOnly) {
        setEditorContent(editor.getHTML())
      }
    },
    immediatelyRender: false,
  })

  // Expose editor globally for task chip insertion
  useEffect(() => {
    console.log('[AgendaEditor] Effect triggered. ReadOnly:', readOnly, 'Editor exists:', !!editor)
    if (editor && !readOnly) {
      console.log('[AgendaEditor] Setting global editor reference')
      ;(window as any).__tiptapEditor = editor
    } else {
      console.log('[AgendaEditor] NOT setting global editor. Reason:', !editor ? 'No editor' : 'ReadOnly')
    }
  }, [editor, readOnly])

  // Handle task chip clicks
  useEffect(() => {
    const handleChipClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const chip = target.closest('.task-chip')

      if (chip) {
        const taskId = chip.getAttribute('data-task-id')
        const tasks = useStore.getState().tasks
        const task = tasks.find((t) => t.id === taskId)

        if (task) {
          useStore.getState().openTaskModal(task.type, task)
        }
      }
    }

    document.addEventListener('click', handleChipClick)
    return () => document.removeEventListener('click', handleChipClick)
  }, [])

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-col min-h-[500px]">
      {/* Toolbar - Only show if not read-only */}
      {!readOnly && (
        <div className="border-b border-border bg-card px-4 py-2 sticky top-0 z-10">
          <div className="flex items-center gap-1 flex-wrap">
            {/* Text formatting */}
            <div className="flex items-center gap-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive('bold')}
                title="Fetstil (Cmd+B)"
              >
                <Bold className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive('italic')}
                title="Kursiv (Cmd+I)"
              >
                <Italic className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                active={editor.isActive('strike')}
                title="Genomstruken"
              >
                <Strikethrough className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                active={editor.isActive('code')}
                title="Kod"
              >
                <Code className="w-4 h-4" />
              </ToolbarButton>
            </div>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Headings */}
            <div className="flex items-center gap-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                active={editor.isActive('heading', { level: 1 })}
                title="Rubrik 1"
              >
                <Heading1 className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                active={editor.isActive('heading', { level: 2 })}
                title="Rubrik 2"
              >
                <Heading2 className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                active={editor.isActive('heading', { level: 3 })}
                title="Rubrik 3"
              >
                <Heading3 className="w-4 h-4" />
              </ToolbarButton>
            </div>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Lists */}
            <div className="flex items-center gap-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive('bulletList')}
                title="Punktlista"
              >
                <List className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                active={editor.isActive('orderedList')}
                title="Nummerlista"
              >
                <ListOrdered className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                active={editor.isActive('blockquote')}
                title="Citat"
              >
                <Quote className="w-4 h-4" />
              </ToolbarButton>
            </div>

            <div className="w-px h-6 bg-border mx-1" />

            {/* History */}
            <div className="flex items-center gap-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Ångra (Cmd+Z)"
              >
                <Undo className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Gör om (Cmd+Y)"
              >
                <Redo className="w-4 h-4" />
              </ToolbarButton>
            </div>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Image */}
            <div className="flex items-center gap-1">
              <ToolbarButton
                onClick={() => {
                  const url = window.prompt('Bildadress (URL):')
                  if (url) {
                    editor.chain().focus().setImage({ src: url }).run()
                  }
                }}
                title="Infoga bild"
              >
                <ImageIcon className="w-4 h-4" />
              </ToolbarButton>
            </div>

            <div className="flex-1" />

            {/* Task & Goal creation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => openTaskModal('goal')}
                onMouseDown={(e) => e.preventDefault()}
                className="px-3 py-1.5 text-sm font-medium bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-md transition-colors flex items-center gap-1.5"
                title="Nytt mål (Cmd+Shift+G)"
              >
                <Target className="w-4 h-4" />
                <span className="hidden lg:inline">Nytt mål</span>
              </button>
              <button
                onClick={() => openTaskModal('task')}
                onMouseDown={(e) => e.preventDefault()}
                className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition-colors flex items-center gap-1.5"
                title="Ny uppgift (Cmd+Shift+T)"
              >
                <CheckSquare className="w-4 h-4" />
                <span className="hidden lg:inline">Ny uppgift</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="flex-1">
        <div className={`px-6 py-6 ${rightPanelCollapsed ? 'max-w-none' : 'max-w-4xl mx-auto'}`}>
          <EditorContent
            editor={editor}
            className="prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[400px]"
          />
        </div>
      </div>
    </div>
  )
}

function ToolbarButton({
  children,
  onClick,
  title,
  active = false,
  disabled = false,
}: {
  children: React.ReactNode
  onClick: () => void
  title?: string
  active?: boolean
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`p-2 rounded hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? 'bg-accent text-primary' : 'text-muted-foreground'
      }`}
    >
      {children}
    </button>
  )
}
