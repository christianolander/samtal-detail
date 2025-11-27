/**
 * SlashCommand Extension for TipTap
 *
 * Provides a slash command menu triggered by typing "/"
 */

import { Extension } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'
import tippy, { Instance as TippyInstance } from 'tippy.js'
import { SlashMenu, SlashMenuRef } from './SlashMenu'

// We need to load tippy.js
// Note: For production, you might want to import tippy's CSS or style it yourself

const SlashCommandExtension = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: { editor: any; range: any; props: any }) => {
          props.command({ editor, range })
        },
      } as Partial<SuggestionOptions>,
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        render: () => {
          let component: ReactRenderer<SlashMenuRef> | null = null
          let popup: TippyInstance[] | null = null

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(SlashMenu, {
                props,
                editor: props.editor,
              })

              if (!props.clientRect) {
                return
              }

              // Create a simple popup using tippy or a div
              const container = document.createElement('div')
              container.style.position = 'absolute'
              container.style.zIndex = '50'
              document.body.appendChild(container)

              // Position the popup
              const rect = props.clientRect()
              if (rect) {
                container.style.left = `${rect.left}px`
                container.style.top = `${rect.bottom + 8}px`
              }

              container.appendChild(component.element)

              // Store reference for cleanup
              ;(component as any).__container = container
            },

            onUpdate: (props: any) => {
              if (component) {
                component.updateProps(props)
              }

              // Update position
              const container = (component as any)?.__container
              if (container && props.clientRect) {
                const rect = props.clientRect()
                if (rect) {
                  container.style.left = `${rect.left}px`
                  container.style.top = `${rect.bottom + 8}px`
                }
              }
            },

            onKeyDown: (props: any) => {
              if (props.event.key === 'Escape') {
                const container = (component as any)?.__container
                if (container) {
                  container.remove()
                }
                component?.destroy()
                return true
              }

              return component?.ref?.onKeyDown(props.event) ?? false
            },

            onExit: () => {
              const container = (component as any)?.__container
              if (container) {
                container.remove()
              }
              component?.destroy()
            },
          }
        },
      }),
    ]
  },
})

export default SlashCommandExtension
