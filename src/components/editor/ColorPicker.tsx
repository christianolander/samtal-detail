/**
 * ColorPicker Component
 *
 * A dropdown color picker for text and background colors.
 */

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Eraser } from 'lucide-react'

const DEFAULT_COLORS = [
  // Row 1: Grays
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
  // Row 2: Reds
  '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
  // Row 3: Lighter
  '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
  // Row 4: Light
  '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd',
  // Row 5: Medium
  '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0',
  // Row 6: Dark
  '#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#a64d79',
]

interface ColorPickerProps {
  editor: any
  type: 'textColor' | 'highlight'
  icon: React.ReactNode
  title: string
}

export default function ColorPicker({ editor, type, icon, title }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customColor, setCustomColor] = useState('#000000')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const applyColor = (color: string) => {
    if (type === 'textColor') {
      editor.chain().focus().setColor(color).run()
    } else {
      editor.chain().focus().toggleHighlight({ color }).run()
    }
    setIsOpen(false)
  }

  const clearColor = () => {
    if (type === 'textColor') {
      editor.chain().focus().unsetColor().run()
    } else {
      editor.chain().focus().unsetHighlight().run()
    }
    setIsOpen(false)
  }

  const getCurrentColor = () => {
    if (type === 'textColor') {
      return editor.getAttributes('textStyle').color || null
    } else {
      return editor.getAttributes('highlight').color || null
    }
  }

  const currentColor = getCurrentColor()

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded hover:bg-accent transition-colors flex items-center gap-0.5 ${
          currentColor ? 'text-foreground' : 'text-muted-foreground'
        }`}
        title={title}
      >
        <div className="relative">
          {icon}
          {currentColor && (
            <div
              className="absolute -bottom-0.5 left-0 right-0 h-1 rounded-full"
              style={{ backgroundColor: currentColor }}
            />
          )}
        </div>
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg p-3 z-50 w-64">
          {/* Color grid */}
          <div className="grid grid-cols-10 gap-1 mb-3">
            {DEFAULT_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => applyColor(color)}
                className={`w-5 h-5 rounded border transition-transform hover:scale-110 ${
                  currentColor === color ? 'ring-2 ring-primary ring-offset-1' : 'border-border'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          {/* Custom color */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-border"
            />
            <button
              onClick={() => applyColor(customColor)}
              className="flex-1 px-3 py-1.5 text-sm bg-muted hover:bg-accent rounded transition-colors"
            >
              Använd anpassad färg
            </button>
          </div>

          {/* Clear button */}
          <button
            onClick={clearColor}
            className="w-full mt-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors flex items-center justify-center gap-2"
          >
            <Eraser className="w-4 h-4" />
            Ta bort färg
          </button>
        </div>
      )}
    </div>
  )
}
