/**
 * SlashInputElement - Renders the slash command palette
 *
 * Features:
 * - Shows on "/" keypress
 * - Filters items as you type
 * - Keyboard navigation (arrow keys, enter)
 * - Click or ESC to close
 */

import { useState, useEffect, useRef } from 'react'
import { useEditorRef, useEditorSelector } from '@udecode/plate'
import { getSlashMenuItems, type SlashMenuItem } from '../plugins/SlashPlugin'

export function SlashInputElement() {
  const editor = useEditorRef()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)

  // Get all menu items
  const allItems = getSlashMenuItems(editor)

  // Filter items based on search
  const filteredItems = search
    ? allItems.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      )
    : allItems

  // Group items
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = []
    }
    acc[item.group].push(item)
    return acc
  }, {} as Record<string, SlashMenuItem[]>)

  // Detect "/" in editor
  const slashDetected = useEditorSelector(
    (editor) => {
      if (!editor.selection) return false

      try {
        const [node, path] = editor.node(editor.selection) || []
        if (!node || !path) return false

        const text = editor.string(path)

        // Check if we just typed "/"
        const offset = editor.selection.anchor.offset
        if (offset > 0 && text[offset - 1] === '/') {
          // Check if this is at the start of a word
          const beforeSlash = text[offset - 2]
          if (!beforeSlash || beforeSlash === ' ' || beforeSlash === '\n') {
            return true
          }
        }

        // Check if we're in the middle of a slash command
        const beforeCursor = text.slice(0, offset)
        const lastSlash = beforeCursor.lastIndexOf('/')
        if (lastSlash !== -1) {
          const beforeLastSlash = beforeCursor[lastSlash - 1]
          if (!beforeLastSlash || beforeLastSlash === ' ' || beforeLastSlash === '\n') {
            const afterSlash = beforeCursor.slice(lastSlash + 1)
            // Check if there's no space after the slash
            if (!afterSlash.includes(' ')) {
              return true
            }
          }
        }
      } catch (e) {
        // Ignore errors
      }

      return false
    },
    []
  )

  // Update open state and search text
  useEffect(() => {
    if (slashDetected && !isOpen) {
      setIsOpen(true)
      setSelectedIndex(0)

      // Extract search text after "/"
      try {
        const [node, path] = editor.node(editor.selection) || []
        if (node && path) {
          const text = editor.string(path)
          const offset = editor.selection.anchor.offset
          const beforeCursor = text.slice(0, offset)
          const lastSlash = beforeCursor.lastIndexOf('/')
          if (lastSlash !== -1) {
            const searchText = beforeCursor.slice(lastSlash + 1)
            setSearch(searchText)
          }
        }
      } catch (e) {
        // Ignore errors
      }
    } else if (!slashDetected && isOpen) {
      setIsOpen(false)
      setSearch('')
    }
  }, [slashDetected, isOpen, editor])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % filteredItems.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + filteredItems.length) % filteredItems.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleSelect(filteredItems[selectedIndex])
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredItems])

  // Handle item selection
  const handleSelect = (item: SlashMenuItem) => {
    // Remove the slash command text
    try {
      const [node, path] = editor.node(editor.selection) || []
      if (node && path) {
        const text = editor.string(path)
        const offset = editor.selection.anchor.offset
        const beforeCursor = text.slice(0, offset)
        const lastSlash = beforeCursor.lastIndexOf('/')

        if (lastSlash !== -1) {
          // Delete from slash to cursor
          const start = { path: [...path, 0], offset: lastSlash }
          const end = { path: [...path, 0], offset }
          editor.delete({ at: { anchor: start, focus: end } })
        }
      }
    } catch (e) {
      // Ignore errors
    }

    // Execute the command
    item.onSelect(editor)

    // Close menu
    setIsOpen(false)
    setSearch('')
  }

  if (!isOpen || filteredItems.length === 0) {
    return null
  }

  return (
    <div
      ref={menuRef}
      className="absolute z-50 mt-2 w-80 bg-card border border-border rounded-lg shadow-xl overflow-hidden"
      style={{
        // Position near cursor - simplified positioning
        left: '20px',
        top: '100px',
      }}
    >
      <div className="max-h-96 overflow-y-auto">
        {Object.entries(groupedItems).map(([group, items]) => (
          <div key={group} className="py-2">
            <div className="px-3 py-1 text-xs font-semibold text-muted-foreground">
              {group}
            </div>
            {items.map((item, index) => {
              const globalIndex = filteredItems.indexOf(item)
              return (
                <button
                  key={item.key}
                  onClick={() => handleSelect(item)}
                  className={`w-full px-3 py-2 flex items-start gap-3 hover:bg-accent transition-colors text-left ${
                    globalIndex === selectedIndex ? 'bg-accent' : ''
                  }`}
                >
                  <span className="text-lg mt-0.5 flex-shrink-0">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">
                      {item.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
