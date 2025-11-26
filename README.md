# Samtal Detail View Prototype

A comprehensive detail view for employee conversations (medarbetarsamtal) that supports the entire lifecycle: planning, execution, and follow-up.

## 📋 Documentation

- **[PRD.md](./PRD.md)** - Complete product specification with all features and interactions
- **[CLAUDE.md](./CLAUDE.md)** - Technical documentation, data structures, and implementation guidance

## 🎯 Purpose

This prototype demonstrates:

- **Stateful conversation management** through three phases: Planering → Pågår → Avslutat
- **Live note-taking** with WYSIWYG editor and slash commands
- **AI-powered summaries** of conversations
- **Goal & task tracking** linked to conversations
- **Historical context** from previous meetings
- **Timer functionality** for meeting duration tracking
- **Smart defaults** that adapt UI based on conversation status

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Link to local proto-ui (for development)
npx yalc add @workly/proto-ui

# Start development server
npm run dev
```

## 🏗️ Technology Stack

- **React 18** + TypeScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **@workly/proto-ui** - Shared component library
- **Zustand** - State management
- **NO DATABASE** - Uses JSON mock data only

## 🎨 Key Features

### 1. Three-Phase Status Model

- **Planering** - Prepare agenda, review previous goals, add prep comments
- **Pågår** - Live note-taking with optional timer
- **Avslutat** - AI summary, follow-up tasks, reflection

### 2. Dual-Tab Interface

**Anteckningar Tab:**
- WYSIWYG agenda editor with pre-filled structure
- Toggle between editing and AI-generated summary
- Slash commands: `/mål`, `/uppgift`
- Smart detection of commitments → suggest creating goals

**Uppgifter & mål Tab:**
- Tasks and goals from this conversation
- Historical active tasks from previous meetings
- Completed items archive
- Origin tracking ("Skapad i samtal 2024")

### 3. Contextual Right Panel

**Status & Detaljer:**
- Status control (segmented toggle)
- Meeting metadata (date, time, location, participants)
- Timer controls (when Pågår)

**Relaterade Samtal:**
- Historical conversations with this employee
- Quick access to previous meeting notes
- Tooltip previews of key goals

### 4. Collaborative Comments

- Full-width collapsible section
- Shared across both tabs
- State-dependent visibility (expanded during Planering & Avslutat)
- Role tags (Chef, HR, Medarbetare)

### 5. Meeting Timer

- Optional timer when status = Pågår
- Counts up from 00:00
- Pause/Resume/Reset controls
- Duration summary saved when Avslutat

## 📊 Data Structure

All data is mock JSON - no database required. See `CLAUDE.md` for complete TypeScript interfaces.

**Core objects:**
- `Samtal` - Current conversation
- `Task` - Goals and tasks
- `HistoricalMeeting` - Previous conversations with AI summaries
- `SurveyData` - Employee survey responses
- `Comment` - Conversation comments

## 🎭 Smart Defaults

The UI automatically adapts based on conversation status:

| Status | Default Tab | Right Panel | Comments | Timer |
|--------|------------|-------------|----------|-------|
| **Planering** | Anteckningar | Expanded | Expanded | Hidden |
| **Pågår** | Anteckningar | Expanded | Collapsed | Visible |
| **Avslutat** | Uppgifter & mål | Expanded | Expanded | Stopped |

## ✨ Delight Features

- Status chip animates when changed
- Timer has subtle tick animation each minute
- Completed tasks slide into archive section
- Comment count badge scales when updated
- Right panel peek on hover when collapsed
- AI summary typewriter effect on first render
- Inline "Skapa mål?" chips for detected commitments

## 🚀 Deployment

### Before Deploying to Netlify

```bash
# Switch from yalc to npm package
npm run prepare:deploy

# Test production build
npm run build
npm run preview
```

### Netlify Configuration

- **Build command:** `npm run build`
- **Publish directory:** `dist/`
- **Environment variables:** None required (no database)

### After Deployment

```bash
# Switch back to yalc for local development
npx yalc add @c.olander/proto-ui
npm install
```

## 📁 Project Structure

```
feature-detail-view/
├── src/
│   ├── components/
│   │   ├── Header/              # Title + tabs + status chip
│   │   ├── Anteckningar/        # Notes tab + editor + AI summary
│   │   ├── UppgifterMal/        # Tasks & goals tab
│   │   ├── RightPanel/          # Status + historical meetings
│   │   ├── Comments/            # Comments section
│   │   └── shared/              # Reusable components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/
│   │   ├── mockData.ts          # All JSON mock data
│   │   └── utils.ts             # Helper functions
│   ├── store/
│   │   └── useStore.ts          # Zustand state management
│   ├── App.tsx                  # Main app component
│   └── index.css                # Global styles + proto-ui theme
├── PRD.md                       # Product specification
├── CLAUDE.md                    # Technical documentation
└── README.md                    # This file
```

## 🧪 Testing Scenarios

See `CLAUDE.md` for detailed testing scenarios including:

1. **Status transitions** - Planering → Pågår → Avslutat flow
2. **Creating tasks from notes** - Smart detection and chips
3. **Historical context** - Relaterade samtal navigation
4. **Comments workflow** - State-dependent visibility

## 🔗 Related Documentation

- [Workspace Guidelines](/Users/colander/dev/prototypes/CLAUDE.md) - Prototyping standards
- [Reference Prototype](/Users/colander/dev/prototypes/feature-call-booking) - Similar structure

## 📝 Notes

- This prototype uses **mock JSON data only** - no database integration
- Focus is on UX/UI interactions and state management
- When adding database later, use table prefix: `detailview_`
- All reference data from previous prototypes synthesized into `mockData.ts`

## 🤝 Contributing

When implementing this prototype:

1. Read `PRD.md` for feature specifications
2. Review `CLAUDE.md` for data structures and component architecture
3. Use `@workly/proto-ui` components where possible
4. Follow semantic CSS variable patterns (no inline Tailwind colors)
5. Test all status transition flows
6. Ensure mobile responsiveness

---

**Status:** 🏗️ Ready for Implementation

For questions or clarifications, refer to the "Questions for Product/Design" section in `CLAUDE.md`.
