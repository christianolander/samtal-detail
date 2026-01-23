"use client"

import { useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"
import { Placeholder } from "@tiptap/extension-placeholder"
import { Color } from "@tiptap/extension-color"
import { TextStyle } from "@tiptap/extension-text-style"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from "@/components/tiptap-ui-primitive/dropdown-menu"
import { Card, CardBody } from "@/components/tiptap-ui-primitive/card"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/tiptap-ui-primitive/popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"
import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon"
import { Target, CheckSquare, Table as TableIcon, Plus, Minus, Trash2, Type, Ban } from "lucide-react"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Custom extensions ---
import { TaskChip } from "@/components/editor/TaskChipExtension"
import { AIBlock } from "@/components/editor/AIBlockExtension"

// --- Store ---
import { useStore } from "@/store/useStore"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

interface AgendaEditorProps {
  initialContent?: string
  readOnly?: boolean
  conversationId?: string // Used for localStorage keying
}

// Table dropdown component
function TableDropdown({ portal = false }: { portal?: boolean }) {
  const { editor } = useTiptapEditor()

  if (!editor) return null

  const isInTable = editor.isActive("table")

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          data-style="ghost"
          className={isInTable ? "tiptap-button-active" : ""}
          aria-label="Tabell"
        >
          <TableIcon className="tiptap-button-icon" />
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" portal={portal} sideOffset={8}>
        <Card className="w-48">
          <CardBody className="p-1">
            {!isInTable ? (
              <DropdownMenuItem
                onSelect={() => {
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run()
                }}
                className="w-full px-2 py-1.5 text-sm text-left text-foreground hover:bg-muted rounded flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Infoga tabell (3x3)
              </DropdownMenuItem>
            ) : (
              <>
                <div className="text-xs font-semibold text-muted-foreground px-2 py-1">
                  Rader
                </div>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().addRowBefore().run()}
                  className="w-full px-2 py-1.5 text-sm text-left text-foreground hover:bg-muted rounded flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Lägg till rad ovanför
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().addRowAfter().run()}
                  className="w-full px-2 py-1.5 text-sm text-left text-foreground hover:bg-muted rounded flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Lägg till rad nedanför
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().deleteRow().run()}
                  className="w-full px-2 py-1.5 text-sm text-left hover:bg-muted rounded flex items-center gap-2 text-destructive cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                  Ta bort rad
                </DropdownMenuItem>

                <div className="border-t border-border my-1" />

                <div className="text-xs font-semibold text-muted-foreground px-2 py-1">
                  Kolumner
                </div>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().addColumnBefore().run()}
                  className="w-full px-2 py-1.5 text-sm text-left text-foreground hover:bg-muted rounded flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Lägg till kolumn före
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().addColumnAfter().run()}
                  className="w-full px-2 py-1.5 text-sm text-left text-foreground hover:bg-muted rounded flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Lägg till kolumn efter
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().deleteColumn().run()}
                  className="w-full px-2 py-1.5 text-sm text-left hover:bg-muted rounded flex items-center gap-2 text-destructive cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                  Ta bort kolumn
                </DropdownMenuItem>

                <div className="border-t border-border my-1" />

                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().deleteTable().run()}
                  className="w-full px-2 py-1.5 text-sm text-left hover:bg-muted rounded flex items-center gap-2 text-destructive cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Ta bort tabell
                </DropdownMenuItem>
              </>
            )}
          </CardBody>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Text color popover - matching the highlight popover style
const TEXT_COLORS = [
  { label: "Default", value: "var(--tt-text-color)", border: "var(--tt-bg-color-contrast)" },
  { label: "Grå", value: "var(--tt-color-text-gray)", border: "var(--tt-color-text-gray-contrast)" },
  { label: "Brun", value: "var(--tt-color-text-brown)", border: "var(--tt-color-text-brown-contrast)" },
  { label: "Orange", value: "var(--tt-color-text-orange)", border: "var(--tt-color-text-orange-contrast)" },
  { label: "Gul", value: "var(--tt-color-text-yellow)", border: "var(--tt-color-text-yellow-contrast)" },
  { label: "Grön", value: "var(--tt-color-text-green)", border: "var(--tt-color-text-green-contrast)" },
  { label: "Blå", value: "var(--tt-color-text-blue)", border: "var(--tt-color-text-blue-contrast)" },
  { label: "Lila", value: "var(--tt-color-text-purple)", border: "var(--tt-color-text-purple-contrast)" },
  { label: "Rosa", value: "var(--tt-color-text-pink)", border: "var(--tt-color-text-pink-contrast)" },
  { label: "Röd", value: "var(--tt-color-text-red)", border: "var(--tt-color-text-red-contrast)" },
]

function TextColorButton({
  color,
  isActive,
  onClick
}: {
  color: typeof TEXT_COLORS[number]
  isActive: boolean
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      data-style="ghost"
      onClick={onClick}
      aria-label={color.label}
      tooltip={color.label}
      data-active-state={isActive ? "on" : "off"}
      style={{ "--highlight-color": color.value, "--highlight-border": color.border } as React.CSSProperties}
    >
      <span
        className="tiptap-button-highlight"
        style={{ "--highlight-color": color.value } as React.CSSProperties}
      />
    </Button>
  )
}

function TextColorPopover() {
  const { editor } = useTiptapEditor()
  const [isOpen, setIsOpen] = useState(false)

  if (!editor) return null

  const currentColor = editor.getAttributes("textStyle").color || null

  const applyColor = (color: string) => {
    if (color === "var(--tt-text-color)") {
      editor.chain().focus().unsetColor().run()
    } else {
      editor.chain().focus().setColor(color).run()
    }
    setIsOpen(false)
  }

  const removeColor = () => {
    editor.chain().focus().unsetColor().run()
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          data-style="ghost"
          data-appearance="default"
          aria-label="Text color"
          tooltip="Textfärg"
        >
          <div className="relative">
            <Type className="w-4 h-4" />
            {currentColor && (
              <div
                className="absolute -bottom-0.5 left-0.5 right-0.5 h-0.5 rounded-full"
                style={{ backgroundColor: currentColor }}
              />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Text colors">
        <Card>
          <CardBody>
            <div className="flex items-center gap-0.5">
              {TEXT_COLORS.slice(0, 5).map((color) => (
                <TextColorButton
                  key={color.label}
                  color={color}
                  isActive={currentColor === color.value}
                  onClick={() => applyColor(color.value)}
                />
              ))}
            </div>
            <div className="flex items-center gap-0.5 mt-0.5">
              {TEXT_COLORS.slice(5).map((color) => (
                <TextColorButton
                  key={color.label}
                  color={color}
                  isActive={currentColor === color.value}
                  onClick={() => applyColor(color.value)}
                />
              ))}
              <div className="w-px h-5 bg-border mx-1" />
              <Button
                type="button"
                data-style="ghost"
                onClick={removeColor}
                aria-label="Ta bort färg"
                tooltip="Ta bort färg"
              >
                <Ban className="w-4 h-4" />
              </Button>
            </div>
          </CardBody>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
  onGoalClick,
  onTaskClick,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
  onGoalClick: () => void
  onTaskClick: () => void
}) => {
  return (
    <>
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
        <TableDropdown portal={isMobile} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <TextColorPopover />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text={isMobile ? "" : "Bild"} />
      </ToolbarGroup>

      <Spacer />

      {/* Goal and Task buttons */}
      <ToolbarGroup>
        <Button
          data-style="ghost"
          onClick={onGoalClick}
          className="!bg-primary/10 !text-primary hover:!bg-primary/20"
          aria-label="Nytt mål"
        >
          <Target className="tiptap-button-icon" />
          {!isMobile && <span className="ml-1 text-sm">Nytt mål</span>}
        </Button>
        <Button
          data-style="ghost"
          onClick={onTaskClick}
          className="!bg-blue-500/10 !text-blue-600 hover:!bg-blue-500/20"
          aria-label="Ny uppgift"
        >
          <CheckSquare className="tiptap-button-icon" />
          {!isMobile && <span className="ml-1 text-sm">Ny uppgift</span>}
        </Button>
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

export default function AgendaEditor({ initialContent, readOnly = false, conversationId }: AgendaEditorProps) {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">("main")
  const toolbarRef = useRef<HTMLDivElement>(null)

  const { setEditorContent, setHasUnsavedChanges } = useStore()
  const openTaskModal = useStore((state) => state.openTaskModal)
  const isInitialMount = useRef(true)
  const lastConversationId = useRef(conversationId)

  // Get conversation-specific localStorage key
  const getLocalStorageKey = (id?: string) => {
    return id ? `samtal-editor-content-${id}` : "samtal-editor-content"
  }

  // Expose store globally for slash menu
  useEffect(() => {
    ;(window as any).__zustandStore = useStore
  }, [])

  // Load content for the current conversation
  const getInitialContent = () => {
    // For read-only mode (historical meetings), always use the provided initialContent
    if (readOnly) {
      return initialContent || "<p>Inga anteckningar tillgängliga.</p>"
    }

    // Check for conversation-specific localStorage content first
    const storageKey = getLocalStorageKey(conversationId)
    const storedContent = localStorage.getItem(storageKey)
    if (storedContent && storedContent.trim()) {
      return storedContent
    }

    // Fall back to the provided initialContent (from mock data)
    if (initialContent && initialContent.trim()) {
      return initialContent
    }

    return "<h1>Lönesamtal</h1><p>Skriv dina anteckningar här...</p>"
  }

  const editor = useEditor({
    immediatelyRender: false,
    editable: !readOnly,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Anteckningar",
        class: readOnly ? "simple-editor simple-editor-readonly" : "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "editor-table",
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "Rubrik..."
          }
          return "Skriv här..."
        },
      }),
      TaskChip,
      AIBlock,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content: getInitialContent(),
    onUpdate: ({ editor }) => {
      if (!readOnly) {
        // Skip setting unsaved changes on first render
        if (isInitialMount.current) {
          isInitialMount.current = false
          // Still update the content in store, but reset the unsaved flag
          const html = editor.getHTML()
          setEditorContent(html)
          // Immediately reset unsaved changes since this is initial load
          setTimeout(() => setHasUnsavedChanges(false), 0)
        } else {
          const html = editor.getHTML()
          setEditorContent(html)
          // Save to conversation-specific localStorage key
          const storageKey = getLocalStorageKey(conversationId)
          localStorage.setItem(storageKey, html)
        }
      }
    },
  })

  // Reset editor content when conversation changes
  useEffect(() => {
    if (editor && !editor.isDestroyed && conversationId !== lastConversationId.current) {
      lastConversationId.current = conversationId
      isInitialMount.current = true
      const newContent = getInitialContent()
      editor.commands.setContent(newContent)
      setTimeout(() => setHasUnsavedChanges(false), 0)
    }
  }, [editor, conversationId, initialContent])

  // Update editor editable state when readOnly prop changes
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(!readOnly)
    }
  }, [editor, readOnly])

  // Expose editor globally for task chip insertion
  useEffect(() => {
    if (editor && !readOnly) {
      ;(window as any).__tiptapEditor = editor
    }
  }, [editor, readOnly])

  // Handle task chip clicks
  useEffect(() => {
    const handleChipClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const chip = target.closest(".task-chip")

      if (chip) {
        const taskId = chip.getAttribute("data-task-id")
        const tasks = useStore.getState().tasks
        const task = tasks.find((t) => t.id === taskId)

        if (task) {
          useStore.getState().openTaskModal(task.type, task)
        }
      }
    }

    document.addEventListener("click", handleChipClick)
    return () => document.removeEventListener("click", handleChipClick)
  }, [])

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  if (!editor) {
    return null
  }

  return (
    <div className="simple-editor-wrapper flex flex-col min-h-[500px]">
      <EditorContext.Provider value={{ editor }}>
        {/* Toolbar - Only show if not read-only */}
        {!readOnly && (
          <Toolbar
            ref={toolbarRef}
            style={{
              position: "sticky",
              top: 59, // Height of avatar-bar above
              zIndex: 10,
              ...(isMobile
                ? {
                    bottom: `calc(100% - ${height - rect.y}px)`,
                  }
                : {}),
            }}
          >
            {mobileView === "main" ? (
              <MainToolbarContent
                onHighlighterClick={() => setMobileView("highlighter")}
                onLinkClick={() => setMobileView("link")}
                isMobile={isMobile}
                onGoalClick={() => openTaskModal("goal", undefined, "editor")}
                onTaskClick={() => openTaskModal("task", undefined, "editor")}
              />
            ) : (
              <MobileToolbarContent
                type={mobileView === "highlighter" ? "highlighter" : "link"}
                onBack={() => setMobileView("main")}
              />
            )}
          </Toolbar>
        )}

        {/* Editor Content */}
        <div className="flex-1 px-6 py-4">
          <EditorContent
            editor={editor}
            role="presentation"
            className="simple-editor-content prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[400px]"
          />
        </div>
      </EditorContext.Provider>
    </div>
  )
}
