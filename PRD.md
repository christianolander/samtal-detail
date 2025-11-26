# PRD – Samtal Detail View (Anteckningar & Uppgifter & mål)

**Version:** 1.0
**Last Updated:** 2025-11-20
**Status:** Draft

---

## Overview

**Scope:** Single Samtal detail page that supports **before, during, and after** the conversation. Focus on structure (tabs, panels) and key interactions. No global nav / main menu required in this prototype.

**Purpose:** Provide a comprehensive, stateful view for managing employee conversations (medarbetarsamtal) through their entire lifecycle - from planning through execution to follow-up.

---

## 0. Page Structure Overview

The Samtal detail page has:

### Header (page level)

- **Title:** `Medarbetarsamtal: [Medarbetarnamn]`
- **Tabs:**
  - Anteckningar
  - Uppgifter & mål
- **Note:** No buttons in header (status, actions, etc. live in the right panel)

### Content area (under the active tab)

Laid out as:

#### Center column

**For Anteckningar tab:**
- Optional timer bar (when Pågår)
- Card with Agenda & anteckningar WYSIWYG / AI-summering toggle

**For Uppgifter & mål tab:**
- Card with structured goals & tasks related to this samtal

#### Right column panel

- Collapsible as a whole
- Contains:
  - **Status & detaljer** (top): status control + key metadata
  - **Relaterade samtal** (below): history and links

### Comments section (full width under center/right)

- Collapsible
- Common across both tabs

---

## 1. Header

### 1.1 Content

- **H1 title:** `Medarbetarsamtal: [Medarbetarnamn]`
- **Below:** Tabs:
  - Anteckningar
  - Uppgifter & mål

### 1.2 Behavior

- Clicking tabs switches content area only
- Header does **not** perform status changes or start/stop meetings
- Status is only displayed here (e.g. small chip), never changed

**Delight:** When status changes (via right panel), the status chip next to the title animates subtly (color fade, little pulse).

---

## 2. Status Model

Status is a property of the samtal:

- **Planering** - Conversation is being planned, agenda being prepared
- **Pågår** - Conversation is actively happening
- **Avslutat** (or Klart, naming TBD) - Conversation is complete

### 2.1 Where status is changed

**Only in right panel, top block ("Status & detaljer").**

**UI pattern:** segmented toggle / radio list or progress stepper:

- ○ Planering
- ○ Pågår
- ○ Avslutat

### 2.2 Status change behavior

When user changes status, we:

1. Confirm if needed (e.g. Pågår → Avslutat)
2. Trigger side effects:
   - **Planering → Pågår** → ask about timer (see §3)
   - **Pågår → Avslutat** → stop timer + gently highlight follow-up areas

---

## 3. Timer (Pågår-state)

### 3.1 Placement

- **Only visible in Pågår**
- Appears above the central card in both tabs:
  ```
  [●] Samtal pågår – 23:41 [Pausa] [Nollställ]
  ```
- Timer bar is subtle and thin, spanning the center column width

### 3.2 Starting the timer

When status switched to **Pågår** from something else:

**Modal or inline prompt in right panel:**

```
"Vill du starta en timer för det här samtalet?"
[Starta timer] [Inte nu]
```

**If user chooses Starta timer:**
- Timer bar appears, starts at 00:00

**If Inte nu:**
- Timer bar stays hidden
- Right panel shows a small link "Starta timer" that can be clicked later

### 3.3 Behavior

- Times up from 00:00
- When status becomes **Avslutat**:
  - Timer stops
  - A small note in right panel: "Samtalet varade i 54 min."
- Optional: allow Pausa/Återuppta

**Delight:** Slight "tick" animation each minute and a tiny confetti spark when timer stops at Avslutat (very subtle, maybe once).

---

## 4. Anteckningar-tab

This is the **"conversation"** view.

### 4.1 Layout

**Top of tab (center column):**
- If status Pågår and timer active → timer bar

**Main card:**
- Header with secondary toggle:
  - Agenda & anteckningar (default)
  - AI-summering
- Body area depends on toggle

### 4.1.1 Agenda & anteckningar view

**Full WYSIWYG editor** (agenda + notes in one document):

- Pre-filled structure (sections: Incheckning, Året som gått, Mål, Lön, etc.)
- Toolbar: basic formatting + **Skapa mål**, **Skapa uppgift**
- Slash commands allowed (`/mål`, `/uppgift`)

**This view is used for:**
- **Before:** editing agenda / prep notes
- **During:** live note-taking
- **After:** adjusting notes if needed

**Delight:**
When user writes something that looks like a commitment ("Lisa ska… innan Q3") a small, non-intrusive inline chip appears on the side: "Skapa mål?" that animates in. Clicking it pre-fills a goal in Uppgifter & mål.

### 4.1.2 AI-summering view

**Read-only** generated summary of the notes in a clean layout:

- Key points
- Decisions
- Suggested actions

**Controls:**
- **Regenerera** (if text changed)
- **Kopiera** (for email or sharing)

**This is mainly used after the samtal.**

**Delight:** Light "typewriter" animation for the first AI summary render (but keep fast).

---

## 5. Uppgifter & mål-tab

This is the **structured follow-up view** for the same samtal.

### 5.1 Layout (center column)

**Top:** optional small explanatory text:
```
"Här ser du mål och uppgifter kopplade till det här samtalet."
```

**Main card**, with internal grouping:

#### Sektion 1: Nya från detta samtal
List of goals/tasks created during this meeting (from notes or directly here).

#### Sektion 2: Pågående sedan tidigare samtal
Goals/tasks with origin `tidigare samtal` but still active.

#### Sektion 3: Historik (avslutade)
Collapsible, default closed. Completed items with date + which samtal.

### 5.2 Item structure

Each item row includes:

- **Title**
- **Status** (Ej påbörjat / Pågår / Klart)
- **Owner** (manager / employee / both)
- **Deadline**
- **Origin** ("Skapad i samtal 2024")

**Controls:**
- `+ Lägg till mål`
- `+ Lägg till uppgift`

### 5.3 Delight features

**When a task becomes Klart:**
- Animate it sliding lightly down into the "Historik" section with a small "check" sound (optional, off by default)

**Tiny tag on items created from the notes:**
- "Från anteckningar" - on hover shows the original sentence snippet

### 5.4 Behavior by status

**Planering:**
- Tab still accessible; used to review previous goals before the meeting

**Pågår:**
- Tab can be open in another browser tab or on a second screen, but main live experience usually on Anteckningar

**Avslutat:**
- This tab becomes the main place managers go to follow up and update status

---

## 6. Right Panel (collapsible)

Same right panel structure in both tabs.

### 6.1 Overall

- Anchored on the right side of the content area
- Can be collapsed into a narrow rail (showing only icons or a "Detaljer" label)
- Collapse control: small chevron button at top-right of the panel

**Delight:** Collapse/expand uses a smooth slide animation; when collapsed, hovering over the rail can peek the panel.

### 6.2 Content blocks

Order (top → bottom):

1. Status & detaljer (top block)
2. Relaterade samtal

### 6.2.1 Status & detaljer

**Status control:**

- **Label:** Status
- **Component:** segmented control / radio stepper with three options:
  - Planering
  - Pågår
  - Avslutat

**Changing status triggers:**

- **Planering → Pågår:** timer question (see §3)
- **Pågår → Avslutat:** confirmation modal ("Är du säker på att samtalet är avslutat?") + stop timer

**Meta fields:**

- **Datum & tid** (with "Redigera" link)
- **Plats:** text + optional meeting link ("Öppna Teams-länk")
- **Deltagare:** list with avatars + roles (chef, medarbetare, ev. HR)
- **Source survey / pulse** (if relevant)

**Delight:** When user changes date/time here, show a small inline "Synkas med kalender…" confirmation that disappears after success.

### 6.2.2 Relaterade samtal

**Title:** Relaterade samtal

**Content:**

Compact vertical list of cards:

```
[Ikon] Medarbetarsamtal 2024 – Klart – 54 min
       Utvecklingssamtal 2023 – Klart
```

Each card clickable → opens that samtal's detail in a new tab.

**Delight:** On hover, a tooltip shows 1–2 key goals from that previous samtal.

---

## 7. Kommentarer-section (collapsible)

### 7.1 Placement

- Full width under the center/right grid
- Available in both tabs (same comments, because they belong to the samtal, not to a tab)

### 7.2 Structure

**Header row:**
- **Title:** Kommentarer
- **Counter:** (2)
- **Collapse toggle:** Visa/Dölj with chevron

**When expanded:**

- **Comment composer at top:**
  - Avatar + multiline input + **Lägg till kommentar**

- **List of comments:**
  - Each comment:
    - Avatar, name, role (Chef/HR/Medarbetare)
    - Timestamp
    - Text
    - Optional tags (e.g. HR only if you support private comments later)

**When collapsed:**
- Only header row visible with count

### 7.3 Delight features

**When someone adds a comment:**
- The "Kommentarer (n)" count gently animates (e.g. scale up then back)

**For long comments:**
- Show a "Läs mer" expander instead of dumping the full wall of text

### 7.4 Behavior & use

**Before:**
- Prep comments (e.g. HR → manager: "Kom ihåg att ta upp föräldraledighetspåverkan på lönen")

**During:**
- Usually left collapsed to avoid noise

**After:**
- Meta reflection or clarification comments

---

## 8. State-dependent defaults

To make the page feel smart without extra controls:

### 8.1 On load for each status

#### Status = **Planering**

- **Tab default:** Anteckningar + Agenda & anteckningar
- **Right panel:** expanded
- **Comments:** expanded (prep discussion encouraged)
- **Timer:** hidden

#### Status = **Pågår**

- **Tab default:** Anteckningar + Agenda & anteckningar
- **Right panel:** expanded by default, but can be collapsed
- **Comments:** collapsed by default (less noise)
- **Timer:**
  - Visible only if previously accepted
  - Otherwise right panel shows "Starta timer"

#### Status = **Avslutat**

- **Default tab:**
  - If user just set to Avslutat: stay on Anteckningar → maybe auto-show AI-summering
  - On later visits: Uppgifter & mål may become default (configurable)
- **Right panel:** expanded
- **Comments:** expanded
- **Timer:** stops; summary of duration appears in right panel

---

## 9. Micro-copy and tone examples

### Status change prompt (Planering → Pågår):
```
"Vill du starta en timer för det här samtalet?"
"Det hjälper dig att se hur lång tid ni faktiskt använder."
```

### Status change prompt (Pågår → Avslutat):
```
"Är du säker på att samtalet är avslutat?"
"Du kan alltid ändra tillbaka om du behöver."
```

### Empty state for Relaterade samtal:
```
"Inga tidigare samtal kopplade till Lisa ännu. Det här blir startpunkten."
```

### Empty state for Kommentarer:
```
"Inga kommentarer ännu. Använd kommentarsfältet för att dela anteckningar mellan samtalen."
```

---

## 10. Success Criteria

This prototype is successful if:

1. ✅ Users can smoothly transition through all three states (Planering → Pågår → Avslutat)
2. ✅ The timer enhances the "during" experience without being intrusive
3. ✅ The AI summary provides genuine value post-conversation
4. ✅ Goals and tasks feel naturally connected to the conversation
5. ✅ The collapsible panels and smart defaults reduce cognitive load
6. ✅ Historical context (relaterade samtal) adds continuity without clutter

---

## 11. Future Considerations (Out of Scope for V1)

- **Multi-participant editing:** Real-time collaboration on notes
- **Integration with calendar systems:** Auto-sync scheduled times
- **Advanced AI features:** Suggested goals based on conversation content
- **Mobile-optimized view:** Dedicated mobile UI patterns
- **Offline mode:** Local-first editing with sync
- **Custom agenda templates:** Team-specific or role-specific templates
- **Analytics dashboard:** Aggregate insights across all samtals
