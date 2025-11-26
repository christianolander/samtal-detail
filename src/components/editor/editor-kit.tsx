/**
 * EditorKit - Plate plugin configuration
 *
 * Defines all available nodes, marks, and behaviors for the editor
 */

import { PlatePlugin } from '@udecode/plate'
import {
  ParagraphPlugin,
  HeadingPlugin,
  BlockquotePlugin,
  CodeBlockPlugin,
  HorizontalRulePlugin,
} from '@udecode/plate'
import { LinkPlugin } from '@udecode/plate'
import { TablePlugin } from '@udecode/plate'
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin,
} from '@udecode/plate'
import { TaskChipPlugin } from './plugins/TaskChipPlugin'
import { SlashPlugin } from './plugins/SlashPlugin'

/**
 * Complete plugin stack for the editor
 */
export const EditorKit: PlatePlugin[] = [
  // Block elements
  ParagraphPlugin,
  HeadingPlugin,
  BlockquotePlugin,
  CodeBlockPlugin,
  TablePlugin,

  // Inline elements
  LinkPlugin,
  TaskChipPlugin,

  // Marks (text formatting)
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin,

  // Behaviors
  SlashPlugin,
]

/**
 * Hook to access the typed editor instance
 */
export function useEditor() {
  // This will be populated by Plate
  return null
}
