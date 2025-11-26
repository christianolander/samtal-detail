# Detail View Prototype

## Feature Overview

**Feature Name:** Samtal Detail View

**Purpose:** A comprehensive detail view for employee conversations (medarbetarsamtal) that supports the entire lifecycle: planning, execution, and follow-up. See [PRD.md](./PRD.md) for complete specification.

**Table Prefix:** `detailview_` (for future database integration)

**Note:** This prototype **does not use a database**. All data is loaded from JSON mock data to demonstrate the UX and interactions.

---

## Technology Stack

- React 18 + TypeScript
- Vite (bundler + dev server)
- Tailwind CSS
- @workly/proto-ui (shared component library)
- **NO DATABASE** - uses mock JSON data only

---

## Data Structures

### Core Conversation (Samtal) Object

```typescript
interface Samtal {
  id: string
  name: string // e.g., "Medarbetarsamtal: Lisa Eriksson"
  status: 'planering' | 'pågår' | 'avslutat'
  participants: Participant[]
  conversationRound: string // e.g., "Medarbetarsamtal 2025"
  deadlineDate: Date // comes from conversationRound
  bookedDate?: Date
  lastUpdated: Date
  notes: string // markdown editor content
  comments: Comment[]
  timer?: {
    startedAt?: Date
    pausedAt?: Date
    totalSeconds: number
  }
  metadata: {
    location?: string
    meetingLink?: string
    surveySource?: string
  }
}
```

### Participant Object

```typescript
interface Participant {
  id: string
  name: string
  email?: string
  title?: string // e.g., "Sales Representative"
  avatar?: string
  roleInSamtal: 'Owner' | 'Editor' | 'Viewer'
}

// Example:
const participant: Participant = {
  id: '1',
  name: 'Lisa Eriksson',
  title: 'Sales Representative',
  roleInSamtal: 'Viewer'
}
```

### Comment Object

```typescript
interface Comment {
  id: string
  text: string
  author: Participant
  timestamp: Date
  tags?: string[] // e.g., ['HR', 'Private']
}
```

### Task & Goal Objects

```typescript
interface Task {
  id: string
  type: 'task' | 'goal'
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed'
  due?: Date
  assignee?: User
  createdAt: Date
  rating?: number // 1-5 rating for goals
  lastStatusUpdate?: Date
  origin?: {
    conversationId: string
    noteAnchor?: string // Link back to note snippet
  }
}

interface User {
  id: string
  name: string
  avatar?: string
  role: 'manager' | 'employee'
}
```

### Survey Data Objects

```typescript
interface SurveyIndexCard {
  title: string
  score?: number // 1-5 scale
  trend?: 'up' | 'down' | 'stable'
  reliability?: number // 0-100 percentage
}

interface SurveyQuestion {
  id: string
  text: string
  score?: number
  change?: number // Change from previous survey
}

interface SurveyComment {
  id: string
  text: string
  timestamp: Date
  tags?: string[]
}

interface SurveyData {
  indexCards: SurveyIndexCard[]
  questions: SurveyQuestion[]
  comments: SurveyComment[]
}

interface HistoricalSurveyData extends SurveyData {
  id: string
  date: Date
  title: string
}
```

### Historical Meeting Object

```typescript
interface HistoricalMeeting {
  id: string
  title: string
  date: Date
  participants: User[]
  agendaContent: string // HTML/Markdown content
  status: 'completed' | 'cancelled'
  duration?: number // in minutes
  aiSummary?: {
    overview: string
    keyDiscussions: string[]
    managerNotes: string[]
    goalsAndTasks: {
      goals: { title: string; status: string }[]
      tasks: { title: string; status: string }[]
    }
    surveyInsights: string[]
    nextSteps: string[]
  }
}
```

---

## Example Mock Data

### Example Samtal (Current Conversation)

```typescript
const currentSamtal: Samtal = {
  id: 'samtal-2025',
  name: 'Medarbetarsamtal: Lisa Eriksson',
  status: 'planering',
  participants: [
    {
      id: '1',
      name: 'Erik Axelsson',
      email: 'erik.axelsson@workly.se',
      title: 'Engineering Manager',
      roleInSamtal: 'Owner'
    },
    {
      id: '2',
      name: 'Lisa Eriksson',
      email: 'lisa.eriksson@workly.se',
      title: 'Sales Representative',
      roleInSamtal: 'Viewer'
    }
  ],
  conversationRound: 'Medarbetarsamtal 2025',
  deadlineDate: new Date('2025-12-31'),
  bookedDate: new Date('2025-11-25T14:00:00'),
  lastUpdated: new Date('2025-11-20'),
  notes: '', // Will be populated from WYSIWYG editor
  comments: [],
  metadata: {
    location: 'Konferensrum A',
    meetingLink: 'https://teams.microsoft.com/...',
  }
}
```

### Example Agenda Content

```markdown
# 💰 Lönesamtal

## 📊 Prestationsöversikt
- Genomgång av årets resultat och bidrag
- Uppnådda mål och leveranser
- Feedback från kollegor och kunder

## 💼 Marknadsanalys
- Branschstandard och lönenivåer
- Intern lönespridning och rättvisa
- Utveckling av rollen

## 🎯 Framtida förväntningar
- Mål och ansvar för kommande period
- Utvecklingsområden och kompetensbehov
- Karriärväg och progression

## 💰 Löneöversyn
- Diskussion om lönejustering
- Andra förmåner och benefits
- Implementering och tidplan
```

---

## Implementation Guidance

### State Management

**Use Zustand for state management** (as shown in the reference data):

```typescript
import { create } from 'zustand'

export interface AppStore {
  // UI State
  currentStatus: 'planering' | 'pågår' | 'avslutat'
  activeTab: 'anteckningar' | 'uppgifter-mål'
  rightPanelCollapsed: boolean
  commentsCollapsed: boolean

  // Timer State
  timerActive: boolean
  timerStartedAt?: Date
  timerPausedAt?: Date
  timerTotalSeconds: number

  // Data
  currentSamtal: Samtal
  tasks: Task[]
  historicalMeetings: HistoricalMeeting[]
  surveyData: SurveyData
  historicalSurveyData: HistoricalSurveyData[]

  // Actions
  setStatus: (status: 'planering' | 'pågår' | 'avslutat') => void
  setActiveTab: (tab: 'anteckningar' | 'uppgifter-mål') => void
  toggleRightPanel: () => void
  toggleComments: () => void

  // Timer Actions
  startTimer: () => void
  pauseTimer: () => void
  stopTimer: () => void
  resetTimer: () => void

  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void

  // Comment Actions
  addComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => void
}
```

### Component Structure

```
src/
├── components/
│   ├── Header/
│   │   ├── SamtalHeader.tsx          # Title + tabs + status chip
│   │   └── TabNavigation.tsx
│   │
│   ├── Anteckningar/
│   │   ├── AnteckningarTab.tsx       # Main tab component
│   │   ├── TimerBar.tsx              # Timer display when Pågår
│   │   ├── AgendaEditor.tsx          # WYSIWYG editor
│   │   ├── AISummary.tsx             # AI-generated summary view
│   │   └── EditorToolbar.tsx         # Formatting + create task/goal
│   │
│   ├── UppgifterMal/
│   │   ├── UppgifterMalTab.tsx       # Main tab component
│   │   ├── TaskList.tsx              # List of tasks/goals
│   │   ├── TaskItem.tsx              # Individual task/goal row
│   │   └── TaskModal.tsx             # Create/edit task modal
│   │
│   ├── RightPanel/
│   │   ├── RightPanel.tsx            # Container with collapse
│   │   ├── StatusDetaljer.tsx        # Status control + metadata
│   │   └── RelateradeSamtal.tsx      # Historical meetings list
│   │
│   ├── Comments/
│   │   ├── CommentsSection.tsx       # Full-width collapsible section
│   │   ├── CommentComposer.tsx       # Add new comment
│   │   └── CommentItem.tsx           # Individual comment
│   │
│   └── shared/
│       ├── StatusBadge.tsx
│       ├── ParticipantAvatar.tsx
│       └── ConfirmModal.tsx
│
├── hooks/
│   ├── useTimer.ts                   # Timer logic
│   ├── useStatusChange.ts            # Status transition logic
│   └── useSmartDefaults.ts           # State-dependent defaults
│
├── lib/
│   ├── mockData.ts                   # All mock JSON data
│   └── utils.ts                      # Helper functions
│
├── store/
│   └── useStore.ts                   # Zustand store
│
├── App.tsx                           # Main app with MainNavigation
└── index.css                         # Import proto-ui theme
```

---

## Key Features & Interactions

### 1. Status Transitions

**Planering → Pågår:**
- Show modal: "Vill du starta en timer för det här samtalet?"
- If yes: show timer bar, start counting
- If no: show "Starta timer" link in right panel

**Pågår → Avslutat:**
- Show confirmation modal: "Är du säker på att samtalet är avslutat?"
- Stop timer
- Update right panel with duration summary
- Optionally switch to AI-summering view

### 2. Timer Behavior

- Only visible when status = 'pågår'
- Counts up from 00:00
- Controls: [Pausa] [Nollställ]
- When stopped: display "Samtalet varade i XX min" in right panel

### 3. WYSIWYG Editor (Anteckningar)

**Features:**
- Pre-filled agenda structure
- Markdown support
- Slash commands: `/mål`, `/uppgift`
- Toolbar: formatting + "Skapa mål" + "Skapa uppgift"
- Auto-save to localStorage

**Smart detection:**
- When user writes commitment patterns ("Lisa ska... innan Q3")
- Show inline chip: "Skapa mål?"
- Clicking pre-fills goal modal

### 4. AI Summary

**Toggle:** Agenda & anteckningar ↔ AI-summering

**Content:**
- Overview
- Key discussions
- Decisions
- Suggested actions

**Controls:**
- Regenerera (if notes changed)
- Kopiera (copy to clipboard)

### 5. Tasks & Goals Management

**Three sections:**
1. **Nya från detta samtal** - Created during current meeting
2. **Pågående sedan tidigare** - From historical meetings, still active
3. **Historik** - Completed items (collapsed by default)

**Each item shows:**
- Title
- Status (Ej påbörjat / Pågår / Klart)
- Owner (manager / employee)
- Deadline
- Origin ("Skapad i samtal 2024")

**Special features:**
- Items from notes tagged with "Från anteckningar"
- Hover shows original sentence snippet
- Completing a task animates it sliding into Historik

### 6. Right Panel

**Collapsible:**
- Chevron button at top-right
- Smooth slide animation
- When collapsed: shows narrow rail with icons
- Hover to peek

**Status & detaljer block:**
- Status segmented control
- Datum & tid (editable)
- Plats + meeting link
- Deltagare list with avatars

**Relaterade samtal block:**
- Vertical list of historical meetings
- Each card: title, status, duration
- Clickable → opens in new tab
- Hover tooltip: shows 1-2 key goals

### 7. Comments Section

**Full-width, below main content:**

- Collapsible with counter badge
- Comment composer at top
- Each comment shows:
  - Avatar + name + role
  - Timestamp
  - Text (with "Läs mer" for long comments)
  - Optional tags

**Behavior:**
- **Planering:** Expanded (encourage prep discussion)
- **Pågår:** Collapsed (reduce noise)
- **Avslutat:** Expanded (reflection encouraged)

---

## Smart Defaults (State-dependent)

### Status = Planering

- Default tab: **Anteckningar**
- Editor mode: **Agenda & anteckningar**
- Right panel: **Expanded**
- Comments: **Expanded**
- Timer: **Hidden**

### Status = Pågår

- Default tab: **Anteckningar**
- Editor mode: **Agenda & anteckningar**
- Right panel: **Expanded** (but can collapse)
- Comments: **Collapsed**
- Timer: **Visible** (if accepted) or "Starta timer" link

### Status = Avslutat

- Default tab: **Uppgifter & mål** (or stay on Anteckningar if just closed)
- Editor mode: **AI-summering** (if just closed)
- Right panel: **Expanded**
- Comments: **Expanded**
- Timer: **Stopped** with duration summary

---

## Using Reference Data from Earlier Prototype

The user provided extensive mock data from a previous prototype. **Use this as the foundation for your mock data:**

### Key data to synthesize:

1. **Tasks array** - Mix of historical completed tasks and active goals
2. **Survey data** - Index cards, questions, comments with timestamps
3. **Historical survey data** - Multiple periods (Q1 2024, Q4 2023)
4. **Historical meetings** - With full agenda content, AI summaries, participant info
5. **Private notes** - Manager's private reflections

### Example task from reference:

```typescript
{
  id: 'goal-2024-senior',
  type: 'goal',
  title: 'Bli Senior Developer',
  description: 'Övergång till senior-rollen med tech lead-ansvar inom 6 månader',
  status: 'pending',
  rating: 4,
  due: new Date('2024-09-15'),
  assignee: { id: '2', name: 'Anna Andersson', role: 'employee' },
  createdAt: new Date('2024-03-15'),
  lastStatusUpdate: new Date('2024-08-20'),
}
```

### Example historical meeting from reference:

```typescript
{
  id: 'meeting-2024',
  title: 'Medarbetarsamtal 2024',
  date: new Date('2024-03-15'),
  participants: [
    { id: '1', name: 'Erik Axelsson', role: 'manager' },
    { id: '2', name: 'Anna Andersson', role: 'employee' }
  ],
  status: 'completed',
  agendaContent: `...`, // Full HTML with embedded task chips
  aiSummary: {
    overview: "Ett mycket positivt medarbetarsamtal...",
    keyDiscussions: [...],
    managerNotes: [...],
    // ... etc
  }
}
```

**Create a `mockData.ts` file in `src/lib/` that includes:**
- Current samtal (Lisa Eriksson)
- Historical meetings (2024, 2023)
- All tasks/goals from both meetings
- Survey data (current + historical)
- Manager's private notes

---

## Design System Integration

### Using @workly/proto-ui

**Import in `src/index.css`:**

```css
@import "tailwindcss";
@import "@workly/proto-ui/theme.css";

@source "../src";
@source "../node_modules/@workly/proto-ui/dist";
@source "../.yalc/@workly/proto-ui/dist";
```

### Available components:

- `MainNavigation` - Use for top nav
- `Button` - Primary actions
- `Tabs` - For Anteckningar / Uppgifter & mål
- `Badge` - Status chips
- `Card` - Content containers
- More in @workly/proto-ui

### Important styling rules:

**DO NOT:**
- Use inline Tailwind colors like `bg-white`, `text-black`
- Use Tailwind utilities for SVG fills/strokes (unreliable with JIT)

**DO:**
- Use semantic CSS variables from theme
- Use `currentColor` for SVG styling
- Support light/dark mode
- Mobile-first responsive design

---

## Delight Features (Animation & UX Polish)

### Subtle Animations:

1. **Status chip in header** - Pulse/color fade when status changes
2. **Timer tick** - Slight animation each minute
3. **Timer stop** - Tiny confetti spark (very subtle, once)
4. **Task completion** - Slide into Historik with check sound
5. **Comment count** - Scale up/back when new comment added
6. **Right panel collapse** - Smooth slide animation
7. **AI summary first render** - Light typewriter effect
8. **Commitment detection** - Inline "Skapa mål?" chip animates in
9. **Date/time save** - "Synkas med kalender…" confirmation appears

### Smart Interactions:

1. **Relaterade samtal hover** - Tooltip with key goals
2. **Task from notes** - Tag shows original snippet on hover
3. **Long comments** - "Läs mer" expander
4. **Right panel peek** - Hover over rail when collapsed

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Link to local proto-ui (for development)
npx yalc add @workly/proto-ui

# Start dev server
npm run dev
```

### File Structure to Create

```
feature-detail-view/
├── src/
│   ├── components/          # React components (structure above)
│   ├── hooks/               # Custom React hooks
│   ├── lib/
│   │   ├── mockData.ts      # All JSON mock data
│   │   └── utils.ts
│   ├── store/
│   │   └── useStore.ts      # Zustand store
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── .env.example
├── .gitignore
├── .npmrc
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── PRD.md                   # Complete specification
├── CLAUDE.md                # This file
└── README.md
```

---

## No Database - JSON Only

**IMPORTANT:** This prototype does NOT use Supabase or any database.

**Why?**
- Faster iteration on UX/UI
- Focus on interactions and state management
- Demonstrate all features with realistic mock data

**All data lives in:**
- `src/lib/mockData.ts` - Static mock data
- Zustand store - Runtime state
- localStorage - Optional persistence for editor content

**When implementing database later:**
- Add table prefix: `detailview_`
- Follow same structure as `feature-call-booking`
- Add migrations in `supabase/migrations/`

---

## Deployment

### Before Deploying to Netlify

```bash
# Prepare for deployment (switch from yalc to npm package)
npm run prepare:deploy

# Test build
npm run build
npm run preview
```

### Netlify Configuration

**Build command:** `npm run build`
**Publish directory:** `dist/`

**Environment variables:**
- None required (no database)

### After Deployment

```bash
# Switch back to yalc for local development
npx yalc add @c.olander/proto-ui
npm install
```

---

## Testing Scenarios

### Scenario 1: Planering → Pågår → Avslutat

1. Load page in Planering status
2. Verify right panel expanded, comments expanded
3. Click status → Pågår
4. Verify timer modal appears
5. Accept timer → verify timer starts
6. Add some notes in editor
7. Click status → Avslutat
8. Verify confirmation modal
9. Confirm → verify timer stops, duration shown
10. Verify AI-summering suggested

### Scenario 2: Creating Tasks from Notes

1. Open Anteckningar tab
2. Type: "Lisa ska förbättra kommunikation innan Q3"
3. Verify "Skapa mål?" chip appears
4. Click chip → verify goal modal pre-filled
5. Save goal
6. Switch to Uppgifter & mål tab
7. Verify goal appears in "Nya från detta samtal"
8. Hover over goal → verify "Från anteckningar" tag

### Scenario 3: Historical Context

1. Open right panel
2. Verify Relaterade samtal shows 2023 and 2024 meetings
3. Hover over 2024 meeting
4. Verify tooltip shows key goals
5. Click meeting → verify opens in new tab
6. Switch to Uppgifter & mål tab
7. Verify "Pågående sedan tidigare" section shows historical tasks

### Scenario 4: Comments Workflow

1. Status = Planering → Comments expanded
2. Add prep comment as HR: "Kom ihåg löneöversyn"
3. Change status → Pågår
4. Verify comments auto-collapse
5. Change status → Avslutat
6. Verify comments auto-expand
7. Add reflection comment
8. Verify counter updates with animation

---

## Next Steps for Implementation

1. ✅ Scaffold folder structure
2. ✅ Create documentation (PRD.md, CLAUDE.md)
3. **TODO:** Set up Vite + React + TypeScript
4. **TODO:** Configure Tailwind + @workly/proto-ui
5. **TODO:** Create mockData.ts with all reference data
6. **TODO:** Implement Zustand store
7. **TODO:** Build component tree (start with Header → Tabs → Right Panel)
8. **TODO:** Implement Anteckningar tab (editor + AI summary)
9. **TODO:** Implement Uppgifter & mål tab
10. **TODO:** Add timer functionality
11. **TODO:** Implement status transitions
12. **TODO:** Add comments section
13. **TODO:** Polish with delight features
14. **TODO:** Test all scenarios
15. **TODO:** Deploy to Netlify

---

## Questions for Product/Design

1. Should timer have sound notifications at intervals?
2. Should "Skapa mål?" chip use AI detection or simple pattern matching?
3. Should historical meetings be lazy-loaded or all loaded upfront?
4. Should we persist editor content to localStorage between sessions?
5. Should comments support @mentions or tagging participants?
6. Should we show a diff view when switching between agenda versions?

---

## References

- [PRD.md](./PRD.md) - Complete product specification
- [Root CLAUDE.md](/Users/colander/dev/prototypes/CLAUDE.md) - Workspace guidelines
- `@workly/proto-ui` - Shared component library
- Reference prototype: `feature-call-booking` - For structure examples
