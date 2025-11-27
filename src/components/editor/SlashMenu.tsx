/**
 * SlashMenu Component
 *
 * A command palette triggered by typing "/" in the editor.
 * Provides quick access to formatting options and block types.
 */

import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react'
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Table,
  Minus,
  Type,
  Target,
  CheckSquare,
  Image as ImageIcon,
  Highlighter,
} from 'lucide-react'

export interface SlashMenuItem {
  title: string
  description: string
  icon: React.ReactNode
  command: (props: { editor: any; range: any }) => void
}

export interface SlashMenuGroup {
  title: string
  items: SlashMenuItem[]
}

const SLASH_MENU_GROUPS: SlashMenuGroup[] = [
  {
    title: 'Text',
    items: [
      {
        title: 'Text',
        description: 'Vanlig paragraf',
        icon: <Type className="w-4 h-4" />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setParagraph().run()
        },
      },
      {
        title: 'Rubrik 1',
        description: 'Stor rubrik',
        icon: <Heading1 className="w-4 h-4" />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()
        },
      },
      {
        title: 'Rubrik 2',
        description: 'Mellanrubrik',
        icon: <Heading2 className="w-4 h-4" />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run()
        },
      },
      {
        title: 'Rubrik 3',
        description: 'Liten rubrik',
        icon: <Heading3 className="w-4 h-4" />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run()
        },
      },
    ],
  },
  {
    title: 'Listor',
    items: [
      {
        title: 'Punktlista',
        description: 'Lista med punkter',
        icon: <List className="w-4 h-4" />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run()
        },
      },
      {
        title: 'Numrerad lista',
        description: 'Lista med nummer',
        icon: <ListOrdered className="w-4 h-4" />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run()
        },
      },
    ],
  },
  {
    title: 'Block',
    items: [
      {
        title: 'Citat',
        description: 'Blockquote för citat',
        icon: <Quote className="w-4 h-4" />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setBlockquote().run()
        },
      },
      {
        title: 'Kodblock',
        description: 'Block för kod',
        icon: <Code className="w-4 h-4" />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setCodeBlock().run()
        },
      },
      {
        title: 'Avdelare',
        description: 'Horisontell linje',
        icon: <Minus className="w-4 h-4" />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setHorizontalRule().run()
        },
      },
      {
        title: 'Tabell',
        description: 'Infoga en tabell',
        icon: <Table className="w-4 h-4" />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        },
      },
    ],
  },
  {
    title: 'Media',
    items: [
      {
        title: 'Bild',
        description: 'Infoga bild från URL',
        icon: <ImageIcon className="w-4 h-4" />,
        command: ({ editor, range }) => {
          const url = window.prompt('Bildadress (URL):')
          if (url) {
            editor.chain().focus().deleteRange(range).setImage({ src: url }).run()
          }
        },
      },
    ],
  },
  {
    title: 'Mål & Uppgifter',
    items: [
      {
        title: 'Nytt mål',
        description: 'Skapa ett nytt mål',
        icon: <Target className="w-4 h-4 text-teal-600" />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).run()
          // Trigger goal modal via global store
          const { openTaskModal } = (window as any).__zustandStore?.getState?.() || {}
          if (openTaskModal) openTaskModal('goal')
        },
      },
      {
        title: 'Ny uppgift',
        description: 'Skapa en ny uppgift',
        icon: <CheckSquare className="w-4 h-4 text-blue-600" />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).run()
          // Trigger task modal via global store
          const { openTaskModal } = (window as any).__zustandStore?.getState?.() || {}
          if (openTaskModal) openTaskModal('task')
        },
      },
    ],
  },
]

interface SlashMenuProps {
  editor: any
  range: any
  query: string
}

export interface SlashMenuRef {
  onKeyDown: (event: KeyboardEvent) => boolean
}

export const SlashMenu = forwardRef<SlashMenuRef, SlashMenuProps>(
  ({ editor, range, query }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const menuRef = useRef<HTMLDivElement>(null)

    // Filter items based on query
    const filteredGroups = SLASH_MENU_GROUPS.map(group => ({
      ...group,
      items: group.items.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      ),
    })).filter(group => group.items.length > 0)

    // Flatten items for navigation
    const allItems = filteredGroups.flatMap(group => group.items)

    const selectItem = useCallback(
      (index: number) => {
        const item = allItems[index]
        if (item) {
          item.command({ editor, range })
        }
      },
      [allItems, editor, range]
    )

    const upHandler = useCallback(() => {
      setSelectedIndex((selectedIndex + allItems.length - 1) % allItems.length)
    }, [allItems.length, selectedIndex])

    const downHandler = useCallback(() => {
      setSelectedIndex((selectedIndex + 1) % allItems.length)
    }, [allItems.length, selectedIndex])

    const enterHandler = useCallback(() => {
      selectItem(selectedIndex)
    }, [selectItem, selectedIndex])

    useEffect(() => {
      setSelectedIndex(0)
    }, [query])

    useImperativeHandle(ref, () => ({
      onKeyDown: (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
          upHandler()
          return true
        }
        if (event.key === 'ArrowDown') {
          downHandler()
          return true
        }
        if (event.key === 'Enter') {
          enterHandler()
          return true
        }
        return false
      },
    }))

    // Scroll selected item into view
    useEffect(() => {
      const menu = menuRef.current
      if (menu) {
        const selectedEl = menu.querySelector(`[data-index="${selectedIndex}"]`)
        if (selectedEl) {
          selectedEl.scrollIntoView({ block: 'nearest' })
        }
      }
    }, [selectedIndex])

    if (allItems.length === 0) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-sm text-muted-foreground">
          Inga kommandon hittades
        </div>
      )
    }

    let itemIndex = 0

    return (
      <div
        ref={menuRef}
        className="bg-card border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto w-64"
      >
        {filteredGroups.map((group, groupIndex) => (
          <div key={group.title}>
            {groupIndex > 0 && <div className="border-t border-border" />}
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {group.title}
            </div>
            {group.items.map((item) => {
              const currentIndex = itemIndex++
              const isSelected = currentIndex === selectedIndex

              return (
                <button
                  key={item.title}
                  data-index={currentIndex}
                  onClick={() => selectItem(currentIndex)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                    isSelected ? 'bg-accent' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    )
  }
)

SlashMenu.displayName = 'SlashMenu'

export default SlashMenu
