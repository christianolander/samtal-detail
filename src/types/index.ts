/**
 * Type Definitions for Samtal Detail View
 *
 * See CLAUDE.md for complete documentation
 */

export interface Participant {
  id: string
  name: string
  email?: string
  title?: string
  avatar?: string
  roleInSamtal: 'Ansvarig' | 'Medarbetare' | 'Redaktör' | 'Deltagare'
}

export interface Comment {
  id: string
  text: string
  author: Participant
  timestamp: Date
  tags?: string[]
}

export interface Timer {
  startedAt?: Date
  pausedAt?: Date
  totalSeconds: number
}

export interface Metadata {
  location?: string
  meetingLink?: string
  surveySource?: string
}

export interface Samtal {
  id: string
  name: string
  status: 'planerad' | 'ej_bokad' | 'bokad' | 'klar'
  type: 'Medarbetarsamtal' | 'Lönerevision' | 'Lönesamtal'
  participants: Participant[]
  conversationRound: string
  deadlineDate: Date
  bookedDate?: Date
  lastUpdated: Date
  notes: string
  comments: Comment[]
  timer?: Timer
  metadata: Metadata
  duration: number // Duration in minutes, default 60
}

export interface User {
  id: string
  name: string
  avatar?: string
  role: 'manager' | 'employee'
}

// Goal status types for tracking progress
export type GoalStatus = 'ligger_efter' | 'gar_enligt_plan' | 'uppnatt' | null

// Follow-up frequency for goals
export type FollowUpFrequency = 'varje_vecka' | 'varannan_vecka' | 'varje_manad' | 'varje_kvartal' | null

// Goal status history entry
export interface GoalStatusUpdate {
  id: string
  status: GoalStatus
  comment?: string
  user: User
  timestamp: Date
}

export interface Task {
  id: string
  type: 'task' | 'goal'
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed'
  due?: Date
  assignee?: User
  createdAt: Date
  goalStatus?: GoalStatus // Status tracking for goals only
  followUpFrequency?: FollowUpFrequency // Follow-up frequency for goals
  statusHistory?: GoalStatusUpdate[] // History of status updates (goals only)
  lastStatusUpdate?: Date
  origin?: {
    conversationId: string
    conversationTitle?: string
    noteAnchor?: string
  }
}

export interface SurveyIndexCard {
  title: string
  score?: number
  trend?: 'up' | 'down' | 'stable'
  reliability?: number
}

export interface SurveyQuestion {
  id: string
  text: string
  score?: number
  change?: number
}

export interface SurveyComment {
  id: string
  text: string
  timestamp: Date
  tags?: string[]
}

export interface SurveyData {
  indexCards: SurveyIndexCard[]
  questions: SurveyQuestion[]
  comments: SurveyComment[]
}

export interface HistoricalSurveyData extends SurveyData {
  id: string
  date: Date
  title: string
}

export interface AIGoalTask {
  title: string
  status: string
  origin?: {
    conversationId: string
  }
}

export interface AISummary {
  overview: string
  keyDiscussions: string[]
  managerNotes: string[]
  goalsAndTasks: {
    goals: AIGoalTask[]
    tasks: AIGoalTask[]
  }
  surveyInsights: string[]
  nextSteps: string[]
}

export interface HistoricalMeeting {
  id: string
  title: string
  date: Date
  type: 'Medarbetarsamtal' | 'Lönerevision' | 'Lönesamtal'
  participants: User[]
  agendaContent: string
  status: 'completed' | 'cancelled'
  duration?: number
  aiSummary?: AISummary
}

export interface PrivateNote {
  id: string
  author: User
  content: string
  timestamp: Date
}

// File types for automatic documentation feature
export type FileUploadStatus = 'uploading' | 'uploaded' | 'processing' | 'error'

export interface UploadedFile {
  id: string
  name: string
  type: string // MIME type
  size: number
  url: string // Object URL or data URL for preview
  thumbnailUrl?: string
  status: FileUploadStatus
  uploadedAt: Date
  source: 'desktop' | 'mobile' // How was the file uploaded
}

// AI Block types for automatic notes
export type AIBlockStatus = 'pending' | 'approved' | 'rejected' | 'editing'

export interface AIGeneratedBlock {
  id: string
  title: string
  content: string // HTML/Markdown content
  goals?: Array<{
    id: string
    title: string
    description?: string
  }>
  tasks?: Array<{
    id: string
    title: string
    assignee?: string
  }>
  status: AIBlockStatus
  originalSourceFileIds: string[] // Which files this block was generated from
}
