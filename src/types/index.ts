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
export type GoalStatus = 'ej_paborjad' | 'ligger_efter' | 'gar_enligt_plan' | 'uppnatt' | null

// Follow-up frequency for goals
export type FollowUpFrequency = 'varje_vecka' | 'varannan_vecka' | 'varje_manad' | 'varje_kvartal' | null

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
