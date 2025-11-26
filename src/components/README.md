# Component Structure

This directory contains all React components for the Samtal Detail View prototype.

See [CLAUDE.md](../../CLAUDE.md) for complete component architecture.

## Directory Organization

```
components/
├── Header/
│   ├── SamtalHeader.tsx          # Title + tabs + status chip
│   └── TabNavigation.tsx          # Tab switching component
│
├── Anteckningar/
│   ├── AnteckningarTab.tsx       # Main tab wrapper
│   ├── TimerBar.tsx              # Timer display (only when Pågår)
│   ├── AgendaEditor.tsx          # WYSIWYG editor with toolbar
│   ├── AISummary.tsx             # AI-generated summary view
│   └── EditorToolbar.tsx         # Formatting + create task/goal buttons
│
├── UppgifterMal/
│   ├── UppgifterMalTab.tsx       # Main tab wrapper
│   ├── TaskList.tsx              # List of tasks/goals with sections
│   ├── TaskItem.tsx              # Individual task/goal row
│   └── TaskModal.tsx             # Create/edit task modal
│
├── RightPanel/
│   ├── RightPanel.tsx            # Container with collapse functionality
│   ├── StatusDetaljer.tsx        # Status control + meeting metadata
│   └── RelateradeSamtal.tsx      # Historical meetings list
│
├── Comments/
│   ├── CommentsSection.tsx       # Full-width collapsible section
│   ├── CommentComposer.tsx       # Add new comment form
│   └── CommentItem.tsx           # Individual comment display
│
└── shared/
    ├── StatusBadge.tsx           # Status indicator chip
    ├── ParticipantAvatar.tsx     # User avatar component
    └── ConfirmModal.tsx          # Generic confirmation modal
```

## Component Implementation Guidelines

### 1. Use @workly/proto-ui components

Import shared components from the component library:

```typescript
import { Button, Tabs, Card, Badge } from '@workly/proto-ui'
```

### 2. State management with Zustand

Access global state using the useStore hook:

```typescript
import { useStore } from '../../store/useStore'

function MyComponent() {
  const { currentStatus, setStatus } = useStore()
  // ...
}
```

### 3. Styling with semantic CSS variables

Use semantic variables instead of inline Tailwind colors:

```tsx
// ❌ BAD
<div className="bg-blue-500 text-white">

// ✅ GOOD
<div className="bg-primary text-foreground">
```

### 4. Mobile-first responsive design

Use Tailwind breakpoints for responsive layouts:

```tsx
<div className="flex flex-col md:flex-row">
  {/* Mobile: stack, Desktop: side-by-side */}
</div>
```

### 5. Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Support screen readers

## Key Component Responsibilities

### Header Components

**SamtalHeader:**
- Display conversation title
- Show status chip (read-only)
- Animate status chip on changes
- Render TabNavigation

**TabNavigation:**
- Switch between Anteckningar and Uppgifter & mål
- Update activeTab in store
- Highlight active tab

### Anteckningar Components

**AnteckningarTab:**
- Container for entire tab content
- Conditionally render TimerBar (when Pågår)
- Toggle between AgendaEditor and AISummary

**TimerBar:**
- Display timer when status = Pågår
- Show elapsed time (MM:SS format)
- Pause/Resume/Reset controls
- Subtle tick animation each minute

**AgendaEditor:**
- WYSIWYG editor with pre-filled agenda
- Toolbar with formatting options
- Slash commands support (/mål, /uppgift)
- Auto-save to localStorage
- Smart commitment detection → "Skapa mål?" chips

**AISummary:**
- Read-only formatted summary
- Sections: Overview, Key discussions, Decisions, Next steps
- Regenerate button
- Copy to clipboard button
- Typewriter animation on first render

### Uppgifter & mål Components

**UppgifterMalTab:**
- Container for tasks and goals
- Render three sections:
  1. Nya från detta samtal
  2. Pågående sedan tidigare
  3. Historik (collapsible)
- Add task/goal buttons

**TaskList:**
- Group tasks by section
- Handle section expand/collapse
- Filter completed items into Historik

**TaskItem:**
- Display task/goal details
- Status dropdown (Ej påbörjat / Pågår / Klart)
- Assignee, deadline, origin
- "Från anteckningar" tag with hover tooltip
- Animate completion → slide to Historik

**TaskModal:**
- Create or edit task/goal
- Form fields: title, description, type, assignee, deadline
- Pre-fill from detected commitments
- Save to store

### Right Panel Components

**RightPanel:**
- Collapsible container
- Chevron button for collapse/expand
- Smooth slide animation
- Peek on hover when collapsed

**StatusDetaljer:**
- **Segmented status control** (Planering / Pågår / Avslutat)
- Trigger status change flow with confirmations
- Display metadata:
  - Datum & tid (editable)
  - Plats + meeting link
  - Deltagare with avatars
  - Timer duration (when stopped)

**RelateradeSamtal:**
- List of historical meetings
- Each card: title, date, status, duration
- Click → open in new tab
- Hover tooltip with key goals

### Comments Components

**CommentsSection:**
- Full-width collapsible section
- Header with title + counter badge
- Collapse/expand toggle
- State-dependent visibility (see PRD §8.1)

**CommentComposer:**
- Textarea for new comment
- Avatar of current user
- "Lägg till kommentar" button
- Auto-focus when expanded

**CommentItem:**
- Avatar + name + role badge
- Timestamp
- Comment text
- "Läs mer" expander for long comments
- Optional tags (HR, Private, etc.)

### Shared Components

**StatusBadge:**
- Colored chip for status display
- Colors: Planering (gray), Pågår (blue), Avslutat (green)
- Animate on status change

**ParticipantAvatar:**
- User avatar with fallback to initials
- Size variants (sm, md, lg)
- Tooltip with full name + role

**ConfirmModal:**
- Generic confirmation dialog
- Used for status transitions
- Custom title, message, confirm/cancel buttons

## Next Steps

1. Set up Vite + React + TypeScript
2. Install and configure Tailwind + @workly/proto-ui
3. Create mockData.ts with all reference data
4. Implement Zustand store
5. Build components in this order:
   - Shared components first
   - Header + TabNavigation
   - Right panel
   - Comments section
   - Anteckningar tab
   - Uppgifter & mål tab
6. Add delight features (animations)
7. Test all status transition flows

---

Refer to [PRD.md](../../PRD.md) and [CLAUDE.md](../../CLAUDE.md) for detailed specifications.
