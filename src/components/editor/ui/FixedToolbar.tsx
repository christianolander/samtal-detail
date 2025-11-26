/**
 * FixedToolbar - Always-visible toolbar at top of editor
 *
 * Contains:
 * - Block type dropdown (Turn into: Text, H1-H6, lists, code, quote)
 * - History (undo/redo)
 * - Text formatting (bold, italic, etc.)
 * - Link, table insertion
 * - Task and goal creation buttons
 * - More menu with additional options
 */

import { useState } from 'react'
import { useEditorRef, useEditorSelector } from '@udecode/plate'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link2,
  Table,
  Target,
  CheckSquare,
  Undo,
  Redo,
  MoreHorizontal,
  ChevronDown,
  Code,
  List,
  ListOrdered,
  Quote,
  X,
} from 'lucide-react'
import { useStore } from '@/store/useStore'

export function FixedToolbar() {
  const editor = useEditorRef()
  const openTaskModal = useStore((state) => state.openTaskModal)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  // Track active marks
  const isBold = useEditorSelector(
    (editor) => !!editor?.marks?.bold,
    []
  )
  const isItalic = useEditorSelector(
    (editor) => !!editor?.marks?.italic,
    []
  )
  const isUnderline = useEditorSelector(
    (editor) => !!editor?.marks?.underline,
    []
  )
  const isStrikethrough = useEditorSelector(
    (editor) => !!editor?.marks?.strikethrough,
    []
  )
  const isCode = useEditorSelector(
    (editor) => !!editor?.marks?.code,
    []
  )

  const handleBold = () => {
    if (!editor) return
    editor.tf.toggle.mark({ key: 'bold' })
  }

  const handleItalic = () => {
    if (!editor) return
    editor.tf.toggle.mark({ key: 'italic' })
  }

  const handleUnderline = () => {
    if (!editor) return
    editor.tf.toggle.mark({ key: 'underline' })
  }

  const handleStrikethrough = () => {
    if (!editor) return
    editor.tf.toggle.mark({ key: 'strikethrough' })
  }

  const handleCode = () => {
    if (!editor) return
    editor.tf.toggle.mark({ key: 'code' })
  }

  const handleLink = () => {
    if (!editor) return
    setShowLinkModal(true)
  }

  const insertLink = () => {
    if (!editor || !linkUrl) return

    // Insert link at selection
    editor.tf.insert.link({ url: linkUrl })

    setShowLinkModal(false)
    setLinkUrl('')
  }

  const handleTable = () => {
    if (!editor) return
    // Insert a 2x2 table
    editor.tf.insert.table({ rowCount: 2, colCount: 2 })
  }

  return (
    <>
      <div className="border-b border-border bg-card px-4 py-2">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Block Type Dropdown */}
          <BlockTypeDropdown editor={editor} />

          <div className="w-px h-6 bg-border mx-1" />

          {/* History */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor?.undo()}
              title="Ångra (Cmd+Z)"
            >
              <Undo className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.redo()}
              title="Gör om (Cmd+Y)"
            >
              <Redo className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Text formatting */}
          <div className="flex items-center gap-1">
            <ToolbarButton onClick={handleBold} title="Fetstil (Cmd+B)" active={isBold}>
              <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={handleItalic} title="Kursiv (Cmd+I)" active={isItalic}>
              <Italic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={handleUnderline} title="Understrykning (Cmd+U)" active={isUnderline}>
              <Underline className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={handleStrikethrough} title="Genomstruken" active={isStrikethrough}>
              <Strikethrough className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={handleCode} title="Kod" active={isCode}>
              <Code className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Link & Table */}
          <div className="flex items-center gap-1">
            <ToolbarButton onClick={handleLink} title="Infoga länk">
              <Link2 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={handleTable} title="Infoga tabell">
              <Table className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Task & Goal - visible on larger screens */}
          <div className="hidden xl:flex items-center gap-2">
            <button
              onClick={() => openTaskModal('goal')}
              className="px-3 py-1.5 text-sm font-medium bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-md transition-colors flex items-center gap-1.5"
              title="Nytt mål (Cmd+Shift+G)"
            >
              <Target className="w-4 h-4" />
              Nytt mål
            </button>
            <button
              onClick={() => openTaskModal('task')}
              className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition-colors flex items-center gap-1.5"
              title="Ny uppgift (Cmd+Shift+T)"
            >
              <CheckSquare className="w-4 h-4" />
              Ny uppgift
            </button>
          </div>

          {/* More menu */}
          <div className="relative">
            <ToolbarButton
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              title="Fler alternativ"
              active={showMoreMenu}
            >
              <MoreHorizontal className="w-4 h-4" />
            </ToolbarButton>

            {showMoreMenu && (
              <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-50 py-1 min-w-[180px]">
                <button
                  onClick={() => {
                    editor?.tf.insert.codeBlock()
                    setShowMoreMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Code className="w-4 h-4" />
                  Kodblock
                </button>
                <button
                  onClick={() => {
                    editor?.setNodes({ type: 'blockquote' })
                    setShowMoreMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Quote className="w-4 h-4" />
                  Citat
                </button>
                <div className="h-px bg-border my-1" />
                <button
                  onClick={() => {
                    openTaskModal('goal')
                    setShowMoreMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2 xl:hidden"
                >
                  <Target className="w-4 h-4" />
                  Nytt mål
                </button>
                <button
                  onClick={() => {
                    openTaskModal('task')
                    setShowMoreMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2 xl:hidden"
                >
                  <CheckSquare className="w-4 h-4" />
                  Ny uppgift
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Infoga länk</h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  insertLink()
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={insertLink}
                disabled={!linkUrl}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Infoga
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function BlockTypeDropdown({ editor }: { editor: any }) {
  const [isOpen, setIsOpen] = useState(false)

  // Get current block type
  const currentBlockType = useEditorSelector(
    (editor) => {
      if (!editor.selection) return 'p'
      try {
        const [node] = editor.node(editor.selection) || []
        return node?.type || 'p'
      } catch {
        return 'p'
      }
    },
    []
  )

  const blockTypes = [
    { value: 'p', label: 'Text', icon: null },
    { value: 'h1', label: 'Rubrik 1', icon: 'H1' },
    { value: 'h2', label: 'Rubrik 2', icon: 'H2' },
    { value: 'h3', label: 'Rubrik 3', icon: 'H3' },
    { value: 'ul', label: 'Punktlista', icon: <List className="w-4 h-4" /> },
    { value: 'ol', label: 'Nummerlista', icon: <ListOrdered className="w-4 h-4" /> },
    { value: 'code_block', label: 'Kodblock', icon: <Code className="w-4 h-4" /> },
    { value: 'blockquote', label: 'Citat', icon: <Quote className="w-4 h-4" /> },
  ]

  const currentBlock = blockTypes.find((b) => b.value === currentBlockType) || blockTypes[0]

  const handleBlockChange = (type: string) => {
    if (!editor) return
    editor.setNodes({ type })
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors"
      >
        {typeof currentBlock.icon === 'string' ? (
          <span className="text-xs font-bold w-5 text-center">{currentBlock.icon}</span>
        ) : currentBlock.icon ? (
          currentBlock.icon
        ) : (
          <span className="w-5" />
        )}
        <span>{currentBlock.label}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-50 py-1 min-w-[180px]">
          {blockTypes.map((block) => (
            <button
              key={block.value}
              onClick={() => handleBlockChange(block.value)}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2 ${
                currentBlockType === block.value ? 'bg-accent text-primary' : ''
              }`}
            >
              {typeof block.icon === 'string' ? (
                <span className="text-xs font-bold w-5 text-center">{block.icon}</span>
              ) : block.icon ? (
                block.icon
              ) : (
                <span className="w-5" />
              )}
              <span>{block.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ToolbarButton({
  children,
  onClick,
  title,
  active = false,
}: {
  children: React.ReactNode
  onClick: () => void
  title?: string
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-accent transition-colors ${
        active ? 'bg-accent text-primary' : 'text-muted-foreground'
      }`}
    >
      {children}
    </button>
  )
}
