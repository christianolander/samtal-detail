/**
 * Zustand Store for Samtal Detail View
 *
 * This store manages all application state including:
 * - UI state (tabs, panels, modals)
 * - Timer state
 * - Current samtal data
 * - Tasks and goals
 * - Comments
 *
 * See CLAUDE.md for complete interface definition.
 */

import { create } from 'zustand'
import type { Samtal, Task, HistoricalMeeting, SurveyData, HistoricalSurveyData, Comment, PrivateNote, Participant } from '../types'
import {
  mockSamtals,
  mockTasks,
  mockHistoricalMeetings,
  mockSurveyData,
  mockHistoricalSurveyData,
  mockPrivateNotes,
  defaultAgendaTemplate,
} from '../lib/mockData'

export interface AppStore {
  // ========================================
  // UI State
  // ========================================
  currentStatus: 'planerad' | 'ej_bokad' | 'bokad' | 'klar'
  activeTab: 'anteckningar' | 'uppgifter-mål'
  rightPanelCollapsed: boolean
  commentsCollapsed: boolean
  editorMode: 'agenda' | 'ai-summary' // For Anteckningar tab
  activeRightPanelTab: 'översikt' | 'detaljer' | 'timer' | 'tidigare' | 'privata'

  // Task modal state
  taskModalOpen: boolean
  taskModalType: 'task' | 'goal' | null
  taskModalTask: Task | null

  // Plate editor reference
  plateEditor: any | null
  savedEditorSelection: any | null

  // Editor state
  hasUnsavedChanges: boolean
  isEditingNotes: boolean
  lastSaved?: Date

  // ========================================
  // Timer State
  // ========================================
  timerActive: boolean
  timerStartedAt?: Date
  timerPausedAt?: Date
  timerTotalSeconds: number
  timerBarVisible: boolean
  timerAlwaysVisible: boolean // Show mini timer when panel is closed
  timerMode: 'timer' | 'countdown'
  timerCountdownSeconds: number // Initial countdown value
  timerStyle: 'default' | 'minimal' | 'neon' | 'nature' | 'retro' | 'cheerful' // Timer visual style
  timerBarPosition: { x: number; y: number } | null // Dragged position, null = default position

  // ========================================
  // Data
  // ========================================
  currentSamtal: Samtal
  tasks: Task[] // Filtered tasks for current conversation
  allTasks: Task[] // All tasks across all conversations
  historicalMeetings: HistoricalMeeting[]
  surveyData: SurveyData
  historicalSurveyData: HistoricalSurveyData[]
  privateNotes: PrivateNote[]
  editorContent: string

  // ========================================
  // Actions - UI State
  // ========================================
  setStatus: (status: 'planerad' | 'ej_bokad' | 'bokad' | 'klar') => void
  setActiveTab: (tab: 'anteckningar' | 'uppgifter-mål') => void
  toggleRightPanel: () => void
  toggleComments: () => void
  setEditorMode: (mode: 'agenda' | 'ai-summary') => void
  setActiveRightPanelTab: (tab: 'översikt' | 'detaljer' | 'timer' | 'tidigare' | 'privata') => void
  loadSamtal: (id: string) => void

  // ========================================
  // Actions - Samtal
  // ========================================
  setDuration: (minutes: number) => void

  // ========================================
  // Actions - Timer
  // ========================================
  startTimer: () => void
  pauseTimer: () => void
  stopTimer: () => void
  resetTimer: () => void
  hideTimerBar: () => void
  showTimerBar: () => void
  setTimerAlwaysVisible: (visible: boolean) => void
  setTimerMode: (mode: 'timer' | 'countdown') => void
  setCountdownSeconds: (seconds: number) => void
  addMinuteToCountdown: () => void
  setTimerStyle: (style: 'default' | 'minimal' | 'neon' | 'nature' | 'retro' | 'cheerful') => void
  setTimerBarPosition: (position: { x: number; y: number } | null) => void

  // ========================================
  // Actions - Tasks
  // ========================================
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void

  // ========================================
  // Actions - Comments
  // ========================================
  addComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => void

  // ========================================
  // Actions - Private Notes
  // ========================================
  addPrivateNote: (content: string) => void
  
  // ========================================
  // Actions - Participants
  // ========================================
  addParticipant: (participant: Participant) => void
  removeParticipant: (participantId: string) => void
  updateParticipantRole: (participantId: string, role: Participant['roleInSamtal']) => void
  setParticipants: (participants: Participant[]) => void

  // ========================================
  // Actions - Task Modal
  // ========================================
  openTaskModal: (type: 'task' | 'goal', task?: Task) => void
  closeTaskModal: () => void
  addTaskWithChip: (taskData: Omit<Task, 'id' | 'createdAt'>) => void

  // ========================================
  // Actions - Editor
  // ========================================
  setEditorContent: (content: string) => void
  setHasUnsavedChanges: (hasChanges: boolean) => void
  setIsEditingNotes: (isEditing: boolean) => void
  saveNotes: () => void

  // ========================================
  // Actions - Booking
  // ========================================
  setBooking: (date: Date, duration: number, location?: string, meetingLink?: string) => void
  removeBooking: () => void
}

export const useStore = create<AppStore>((set, get) => ({
  // ========================================
  // Initial State
  // ========================================
  currentStatus: 'ej_bokad',
  activeTab: 'anteckningar',
  rightPanelCollapsed: false,
  commentsCollapsed: true,
  editorMode: 'agenda',
  activeRightPanelTab: 'översikt',

  taskModalOpen: false,
  taskModalType: null,
  taskModalTask: null,
  plateEditor: null,
  savedEditorSelection: null,

  hasUnsavedChanges: false,
  isEditingNotes: false,
  lastSaved: undefined,

  timerActive: false,
  timerStartedAt: undefined,
  timerPausedAt: undefined,
  timerTotalSeconds: 0,
  timerBarVisible: true,
  timerAlwaysVisible: true,
  timerMode: 'countdown',
  timerCountdownSeconds: (mockSamtals[0].duration || 60) * 60, // Use samtal duration as default
  timerStyle: 'default',
  timerBarPosition: null,

  currentSamtal: mockSamtals[0],
  allTasks: [...mockTasks],
  tasks: mockTasks.filter(task => {
    // Show tasks from first conversation + active tasks from other conversations
    const firstSamtalId = mockSamtals[0].id
    return task.origin?.conversationId === firstSamtalId ||
           (task.origin?.conversationId !== firstSamtalId && task.status !== 'completed')
  }),
  historicalMeetings: mockHistoricalMeetings,
  surveyData: mockSurveyData,
  historicalSurveyData: mockHistoricalSurveyData,
  privateNotes: mockPrivateNotes,
  editorContent: mockSamtals[0].notes || defaultAgendaTemplate,

  // ========================================
  // UI Actions
  // ========================================
  setStatus: (status) => {
    set((state) => {
      // Smart defaults for comments based on status
      let commentsCollapsed = state.commentsCollapsed

      // Bokad: Collapsed (reduce noise)
      if (status === 'bokad') {
        commentsCollapsed = true
      }
      // Klar: Expanded (reflection encouraged)
      else if (status === 'klar') {
        commentsCollapsed = false
      }
      // Planerad/Ej bokad: Keep current state (default closed)

      return {
        currentStatus: status,
        commentsCollapsed,
        currentSamtal: {
          ...state.currentSamtal,
          status: status
        }
      }
    })
  },

  loadSamtal: (id) => {
    const samtal = mockSamtals.find(s => s.id === id)
    if (samtal) {
      const state = get()
      // Filter tasks to show:
      // 1. Tasks from current conversation
      // 2. Tasks from previous conversations that are still active
      const relevantTasks = state.allTasks.filter(task => {
        // Tasks from this conversation
        if (task.origin?.conversationId === id) return true

        // Active tasks from other conversations (show as "ongoing from previous")
        if (task.origin?.conversationId !== id && task.status !== 'completed') return true

        return false
      })

      // Determine default editor mode based on status
      // - "klar" (completed) with AI summary → default to 'ai-summary'
      // - All other statuses → default to 'agenda' (notes only)
      const defaultEditorMode = samtal.status === 'klar' ? 'ai-summary' : 'agenda'

      set({
        currentSamtal: samtal,
        currentStatus: samtal.status,
        tasks: relevantTasks,
        editorContent: samtal.notes || '', // Update editor content
        editorMode: defaultEditorMode, // Reset editor mode based on status
        // Reset other state if needed
        activeTab: 'anteckningar',
        timerTotalSeconds: 0,
        timerActive: false,
        timerStartedAt: undefined,
        timerPausedAt: undefined,
        // Set timer countdown to samtal duration (default 60 min if not set)
        timerCountdownSeconds: (samtal.duration || 60) * 60,
      })
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  toggleRightPanel: () =>
    set((state) => ({ rightPanelCollapsed: !state.rightPanelCollapsed })),

  toggleComments: () =>
    set((state) => ({ commentsCollapsed: !state.commentsCollapsed })),

  setEditorMode: (mode) => set({ editorMode: mode }),

  setActiveRightPanelTab: (tab) => set({ activeRightPanelTab: tab }),

  // ========================================
  // Samtal Actions
  // ========================================
  setDuration: (minutes) =>
    set((state) => ({
      currentSamtal: {
        ...state.currentSamtal,
        duration: minutes,
      },
      // Also update timer countdown to match duration when changed
      timerCountdownSeconds: minutes * 60,
    })),

  // ========================================
  // Timer Actions
  // ========================================
  startTimer: () =>
    set({
      timerActive: true,
      timerStartedAt: new Date(),
      timerPausedAt: undefined,
      timerBarVisible: true,
    }),

  pauseTimer: () =>
    set((state) => {
      if (!state.timerStartedAt) return state

      const now = Date.now()
      const startTime = new Date(state.timerStartedAt).getTime()
      const elapsed = Math.floor((now - startTime) / 1000)

      return {
        timerActive: false,
        timerPausedAt: new Date(),
        timerTotalSeconds: state.timerTotalSeconds + elapsed,
        timerStartedAt: undefined,
      }
    }),

  stopTimer: () =>
    set((state) => {
      let finalSeconds = state.timerTotalSeconds

      // If timer was running when stopped, calculate final elapsed time
      if (state.timerActive && state.timerStartedAt) {
        const now = Date.now()
        const startTime = new Date(state.timerStartedAt).getTime()
        const elapsed = Math.floor((now - startTime) / 1000)
        finalSeconds = state.timerTotalSeconds + elapsed
      }

      return {
        timerActive: false,
        timerPausedAt: undefined,
        timerStartedAt: undefined,
        timerTotalSeconds: finalSeconds,
      }
    }),

  resetTimer: () =>
    set({
      timerActive: false,
      timerStartedAt: undefined,
      timerPausedAt: undefined,
      timerTotalSeconds: 0,
    }),

  hideTimerBar: () => set({ timerBarVisible: false, timerAlwaysVisible: false }),

  showTimerBar: () => set({ timerBarVisible: true }),

  setTimerAlwaysVisible: (visible) => set({ timerAlwaysVisible: visible, timerBarVisible: visible }),

  setTimerMode: (mode) => set({ timerMode: mode }),

  setCountdownSeconds: (seconds) => set({ timerCountdownSeconds: seconds }),

  addMinuteToCountdown: () =>
    set((state) => ({ timerCountdownSeconds: state.timerCountdownSeconds + 60 })),

  setTimerStyle: (style) => set({ timerStyle: style }),

  setTimerBarPosition: (position) => set({ timerBarPosition: position }),

  // ========================================
  // Task Actions
  // ========================================
  addTask: (taskData) =>
    set((state) => {
      const newTask = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
      }
      return {
        allTasks: [...state.allTasks, newTask],
        tasks: [...state.tasks, newTask],
      }
    }),

  updateTask: (id, updates) =>
    set((state) => {
      const updatedTask = (task: Task) =>
        task.id === id
          ? { ...task, ...updates, lastStatusUpdate: new Date() }
          : task

      return {
        allTasks: state.allTasks.map(updatedTask),
        tasks: state.tasks.map(updatedTask),
      }
    }),

  removeTask: (id) =>
    set((state) => ({
      allTasks: state.allTasks.filter((task) => task.id !== id),
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  // ========================================
  // Comment Actions
  // ========================================
  addComment: (commentData) =>
    set((state) => ({
      currentSamtal: {
        ...state.currentSamtal,
        comments: [
          ...(state.currentSamtal.comments || []),
          {
            ...commentData,
            id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
          },
        ],
      },
    })),

  // ========================================
  // Private Notes Actions
  // ========================================
  addPrivateNote: (content) =>
    set((state) => ({
      privateNotes: [
        {
          id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          author: {
            id: '1',
            name: 'Erik Axelsson',
            role: 'manager' as const,
          },
          content,
          timestamp: new Date(),
        },
        ...state.privateNotes,
      ],
    })),

  // ========================================
  // Participant Actions
  // ========================================
  addParticipant: (participant) =>
    set((state) => ({
      currentSamtal: {
        ...state.currentSamtal,
        participants: [...state.currentSamtal.participants, participant],
      },
    })),

  removeParticipant: (participantId) =>
    set((state) => ({
      currentSamtal: {
        ...state.currentSamtal,
        participants: state.currentSamtal.participants.filter(
          (p) => p.id !== participantId
        ),
      },
    })),

  updateParticipantRole: (participantId, role) =>
    set((state) => ({
      currentSamtal: {
        ...state.currentSamtal,
        participants: state.currentSamtal.participants.map((p) =>
          p.id === participantId ? { ...p, roleInSamtal: role } : p
        ),
      },
    })),

  setParticipants: (participants) =>
    set((state) => ({
      currentSamtal: {
        ...state.currentSamtal,
        participants: [...participants],
      },
    })),

  // ========================================
  // Task Modal Actions
  // ========================================
  openTaskModal: (type, task) => {
    // Capture current editor selection if available
    const editor = (window as any).__tiptapEditor
    let selection = null
    let selectedText = ''
    
    if (editor && !editor.isDestroyed) {
      // Save the current selection (JSON format)
      selection = editor.state.selection.toJSON()
      console.log('[openTaskModal] Saved selection:', selection)

      // Try to extract selected text for title pre-fill
      const { from, to, empty } = editor.state.selection
      if (!empty) {
        selectedText = editor.state.doc.textBetween(from, to, ' ')
        console.log('[openTaskModal] Selected text:', selectedText)
      } else {
        // Fallback to DOM selection
        const domSelection = window.getSelection()?.toString()
        if (domSelection) {
          selectedText = domSelection
          console.log('[openTaskModal] DOM Selected text:', selectedText)
        }
      }
    }

    // If no task provided and we have selected text, create a partial task with title
    // Cast to any to bypass strict Task type check since we only need title for pre-fill
    const modalTask = task || (selectedText ? { title: selectedText } as any : null)

    set({ 
      taskModalOpen: true, 
      taskModalType: type, 
      taskModalTask: modalTask,
      savedEditorSelection: selection
    })
  },
  closeTaskModal: () =>
    set({
      taskModalOpen: false,
      taskModalType: null,
      taskModalTask: null,
    }),

  addTaskWithChip: (taskData) => {
    const state = get()
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      origin: {
        conversationId: state.currentSamtal.id,
      },
    }

    // Add task to store
    set((state) => ({
      allTasks: [...state.allTasks, newTask],
      tasks: [...state.tasks, newTask],
    }))

    // Insert visual indicator in editor (TipTap implementation)
    // Create a condensed inline chip that flows with text
    const editor = (window as any).__tiptapEditor

    if (editor && !editor.isDestroyed) {
      try {
        // Check if the editor was focused (i.e., adding from within the editor)
        // vs adding from the separate tasks tab (editor not focused)
        const wasEditorFocused = editor.isFocused
        const savedSelection = get().savedEditorSelection

        if (wasEditorFocused && savedSelection) {
          // Adding from within editor - restore cursor position
          console.log('[addTaskWithChip] Restoring selection:', savedSelection)
          try {
            editor.commands.focus()
            if (savedSelection.type === 'text' && typeof savedSelection.anchor === 'number') {
               editor.commands.setTextSelection({
                 from: savedSelection.anchor,
                 to: savedSelection.head
               })
            }
          } catch (e) {
            console.warn('[addTaskWithChip] Failed to restore selection, falling back to end', e)
            editor.commands.focus('end')
          }
        } else {
          // Adding from tasks tab - always append to the end of document
          editor.commands.focus('end')
        }

        // Try using the setTaskChip command directly first
        editor.commands.setTaskChip({
          taskId: newTask.id,
          title: newTask.title,
          type: taskData.type,
        })

        // Add empty paragraph after
        editor.commands.insertContent('<p></p>')
      } catch (err) {
        console.error('[addTaskWithChip] Failed to insert task chip:', err)
      }
    }
  },

  // ========================================
  // Editor Actions
  // ========================================
  setEditorContent: (content) => {
    set({ editorContent: content, hasUnsavedChanges: true })
    // TODO: Auto-save to localStorage
    localStorage.setItem('samtal-editor-content', content)
  },

  setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),

  setIsEditingNotes: (isEditing) => set({ isEditingNotes: isEditing }),

  saveNotes: () => {
    set({ hasUnsavedChanges: false, lastSaved: new Date() })
    // Additional save logic here (e.g., API call)
    console.log('[saveNotes] Notes saved successfully')
  },

  // ========================================
  // Booking Actions
  // ========================================
  setBooking: (date, duration, location, meetingLink) =>
    set((state) => ({
      currentSamtal: {
        ...state.currentSamtal,
        bookedDate: date,
        duration: duration,
        status: 'bokad',
        metadata: {
          ...state.currentSamtal.metadata,
          location: location,
          meetingLink: meetingLink,
        },
      },
      currentStatus: 'bokad',
      // Also update timer countdown to match new duration
      timerCountdownSeconds: duration * 60,
    })),

  removeBooking: () =>
    set((state) => ({
      currentSamtal: {
        ...state.currentSamtal,
        bookedDate: undefined,
        status: 'ej_bokad',
        metadata: {
          ...state.currentSamtal.metadata,
          location: undefined,
          meetingLink: undefined,
        },
      },
      currentStatus: 'ej_bokad',
    })),
}))
