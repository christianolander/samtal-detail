/**
 * RightPanel Component
 *
 * Fellow-style tabbed panel with contextual tools and information
 * Features: Verktyg, Detaljer, Tidigare samtal, Privata anteckningar
 */

import { useStore } from '../../store/useStore'
import {
  LayoutGrid,
  Info,
  History,
  Lock,
  Calendar,
  Users,
  Target,
  PanelRightOpen,
  PanelRightClose,
  CalendarClock,
  Timer,
  CheckCircle2,
  Sparkles,
  Share2,
  CalendarPlus,
  ListChecks,
  ChevronRight,
} from 'lucide-react'
import StatusDetaljer from './StatusDetaljer'
import RelateradeSamtal from './RelateradeSamtal'
import PrivateNotes from './PrivateNotes'
import TimerTab from './TimerTab'

type TabId = 'översikt' | 'detaljer' | 'tidigare' | 'privata' | 'timer'

interface Tab {
  id: TabId
  label: string
  icon: React.ElementType
  count?: number
}

export default function RightPanel() {
  const {
    rightPanelCollapsed,
    toggleRightPanel,
    setActiveTab,
    privateNotes,
    currentSamtal,
    activeRightPanelTab,
    setActiveRightPanelTab,
    timerActive,
  } = useStore()
  const activeTabId = activeRightPanelTab
  const setActiveTabId = setActiveRightPanelTab

  const tabs: Tab[] = [
    { id: 'översikt', label: 'Översikt', icon: LayoutGrid },
    { id: 'detaljer', label: 'Detaljer', icon: Info },
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'tidigare', label: 'Tidigare samtal', icon: History },
    {
      id: 'privata',
      label: 'Privata anteckningar',
      icon: Lock,
      count: privateNotes.length,
    },
  ]

  // Render contextual overview based on status
  const renderToolsContent = () => {
    const now = new Date()
    const bookedDate = currentSamtal.bookedDate
      ? new Date(currentSamtal.bookedDate)
      : null

    // Helper to determine timing: before, during, or after
    const getTiming = (): 'before' | 'during' | 'after' => {
      if (!bookedDate) return 'before'

      const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const eventDate = new Date(bookedDate.getFullYear(), bookedDate.getMonth(), bookedDate.getDate())

      if (nowDate < eventDate) {
        return 'before' // Before event date
      } else if (nowDate.getTime() === eventDate.getTime()) {
        return 'during' // Same day as event
      } else {
        return 'after' // Day after or later
      }
    }

    const timing = getTiming()
    const status = currentSamtal.status

    const formatTime = (date: Date) =>
      date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
    const formatDate = (date: Date) =>
      date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })

    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Status: Unbooked (ej_bokad) - Before */}
        {(status === 'ej_bokad' || status === 'planerad') && timing === 'before' && (
          <>
            {/* Prominent main card for unbooked */}
            <div className="bg-primary/5 border border-primary/30 rounded-lg p-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div className="w-full">
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    Dags att boka in tid och plats för ditt samtal!
                  </h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Välj tid, plats och skicka inbjudan till deltagarna.
                  </p>
                  <button
                    onClick={() => console.log('Boka samtal')}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Boka samtal
                  </button>
                </div>
              </div>
            </div>

            <ToolSection
              buttons={[
                {
                  icon: Users,
                  label: 'Visa deltagarlistan',
                  subtext: 'Se vem som är ansvarig och vilka som deltar.',
                  variant: 'green',
                  onClick: () => setActiveTabId('detaljer'),
                },
                {
                  icon: History,
                  label: 'Se tidigare samtal',
                  subtext: 'Gå igenom tidigare dialoger med medarbetaren.',
                  variant: 'blue',
                  onClick: () => setActiveTabId('tidigare'),
                },
                {
                  icon: ListChecks,
                  label: 'Se mål och uppgifter',
                  subtext: 'Se tidigare mål och uppgifter att följa upp.',
                  variant: 'orange',
                  onClick: () => setActiveTab('uppgifter-mål'),
                },
              ]}
            />
          </>
        )}

        {/* Status: Booked (bokad) - Before */}
        {status === 'bokad' && timing === 'before' && bookedDate && (
          <>
            {/* Less prominent main card with booking info */}
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                  <CalendarClock className="w-5 h-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    {formatDate(bookedDate)} kl. {formatTime(bookedDate)}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {currentSamtal.metadata.location || 'Plats ej angiven'}
                  </p>
                </div>
              </div>
            </div>

            <ToolSection
              buttons={[
                {
                  icon: CalendarPlus,
                  label: 'Lägg till i kalender',
                  subtext: 'Lägg till mötet i din kalender.',
                  variant: 'blue',
                  onClick: () => console.log('Lägg till i kalender'),
                },
                {
                  icon: Users,
                  label: 'Visa och redigera deltagarlistan',
                  subtext: 'Se och ändra vem som är inbjuden.',
                  variant: 'green',
                  onClick: () => setActiveTabId('detaljer'),
                },
                {
                  icon: History,
                  label: 'Se tidigare samtal',
                  subtext: 'Förbered dig genom att läsa tidigare möten.',
                  variant: 'gray',
                  onClick: () => setActiveTabId('tidigare'),
                },
                {
                  icon: ListChecks,
                  label: 'Se mål och uppgifter',
                  subtext: 'Identifiera vad som ska följas upp.',
                  variant: 'orange',
                  onClick: () => setActiveTab('uppgifter-mål'),
                },
              ]}
            />
          </>
        )}

        {/* Status: Booked (bokad) - During */}
        {status === 'bokad' && timing === 'during' && (
          <>
            {/* No info main card during */}
            <ToolSection
              buttons={[
                {
                  icon: Timer,
                  label: timerActive ? 'Hantera timer' : 'Visa timer',
                  subtext: timerActive ? 'Se och hantera pågående tidtagning.' : 'Starta och hantera tidtagning för mötet.',
                  variant: 'blue',
                  onClick: () => setActiveTabId('timer'),
                },
                {
                  icon: Target,
                  label: 'Lägg till mål och uppgifter',
                  subtext: 'Dokumentera beslut och uppgifter direkt.',
                  variant: 'orange',
                  onClick: () => setActiveTab('uppgifter-mål'),
                },
                {
                  icon: Lock,
                  label: 'Lägg till privata anteckningar',
                  subtext: 'Endast för dig själv.',
                  variant: 'purple',
                  onClick: () => setActiveTabId('privata'),
                },
                {
                  icon: History,
                  label: 'Visa tidigare samtal',
                  subtext: 'Referera till tidigare diskussioner.',
                  variant: 'gray',
                  onClick: () => setActiveTabId('tidigare'),
                },
              ]}
            />
          </>
        )}

        {/* Status: Booked (bokad) - After */}
        {status === 'bokad' && timing === 'after' && (
          <>
            {/* Main card with CTA to mark as complete */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    Markera som klar
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Är samtalet genomfört och dokumenterat? Markera den då som klar.
                  </p>
                  <button
                    onClick={() => useStore.getState().setStatus('klar')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Markera som klar
                  </button>
                </div>
              </div>
            </div>

            <ToolSection
              buttons={[
                {
                  icon: Timer,
                  label: timerActive ? 'Hantera timer' : 'Visa timer',
                  subtext: timerActive ? 'Se och hantera pågående tidtagning.' : 'Starta och hantera tidtagning för mötet.',
                  variant: 'blue',
                  onClick: () => setActiveTabId('timer'),
                },
                {
                  icon: Target,
                  label: 'Lägg till mål och uppgifter',
                  subtext: 'Dokumentera beslut och uppgifter direkt.',
                  variant: 'orange',
                  onClick: () => setActiveTab('uppgifter-mål'),
                },
                {
                  icon: Lock,
                  label: 'Lägg till privata anteckningar',
                  subtext: 'Endast för dig själv.',
                  variant: 'purple',
                  onClick: () => setActiveTabId('privata'),
                },
                {
                  icon: History,
                  label: 'Visa tidigare samtal',
                  subtext: 'Referera till tidigare diskussioner.',
                  variant: 'gray',
                  onClick: () => setActiveTabId('tidigare'),
                },
              ]}
            />
          </>
        )}

        {/* Status: Completed (klar) - After */}
        {status === 'klar' && timing === 'after' && (
          <>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  Samtalet är klart
                </span>
              </div>
              <p className="text-xs text-foreground">
                Sammanfattning har skickats ut till alla deltagare.
              </p>
            </div>

            <ToolSection
              buttons={[
                {
                  icon: Sparkles,
                  label: 'Visa sammanfattning',
                  subtext: 'Läs AI-genererad sammanfattning.',
                  variant: 'pink',
                  onClick: () => setActiveTab('anteckningar'),
                },
                {
                  icon: ListChecks,
                  label: 'Se mål och uppgifter',
                  subtext: 'Se vad ni kom överens om framåt.',
                  variant: 'orange',
                  onClick: () => setActiveTab('uppgifter-mål'),
                },
                {
                  icon: Share2,
                  label: 'Exportera och dela',
                  subtext: 'Exportera eller dela anteckningarna.',
                  variant: 'blue',
                  onClick: () => console.log('Exportera'),
                },
              ]}
            />
          </>
        )}
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTabId) {
      case 'översikt':
        return renderToolsContent()
      case 'timer':
        return <TimerTab />
      case 'detaljer':
        return <StatusDetaljer />
      case 'tidigare':
        return <RelateradeSamtal />
      case 'privata':
        return <PrivateNotes />
    }
  }

  // Collapsed state - just show maximize button
  if (rightPanelCollapsed) {
    return (
      <div className="flex justify-end">
        <button
          onClick={toggleRightPanel}
          className="p-1.5 hover:bg-muted rounded-md transition-colors"
          title="Visa panel"
        >
          <PanelRightOpen className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
    )
  }

  // Expanded state - tabs above panel with minimize button to right
  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      {/* Tab navigation row - above panel */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = tab.id === activeTabId

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`px-2 py-1.5 flex items-center justify-center gap-1.5 transition-colors rounded-md relative ${
                  isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title={tab.label}
              >
                <Icon className={`w-3.5 h-3.5`} />
                {isActive && (
                  <span className="text-xs font-medium">{tab.label}</span>
                )}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </button>
            )
          })}
        </div>
        <button
          onClick={toggleRightPanel}
          className="p-1.5 hover:bg-muted rounded-md transition-colors"
          title="Dölj panel"
        >
          <PanelRightClose className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Panel content */}
      <div className="bg-card border border-border rounded-lg p-4 overflow-y-auto flex-1">
        {renderTabContent()}
      </div>
    </div>
  )
}

function ToolSection({
  title,
  subtext,
  headerBadge,
  headerChip,
  buttons,
}: {
  title?: string
  subtext?: string
  headerBadge?: string
  headerChip?: string
  buttons: Array<{
    icon: React.ElementType
    label: string
    subtext?: string
    variant?: 'default' | 'primary' | 'accent' | 'success' | 'green' | 'blue' | 'pink' | 'orange' | 'purple' | 'gray'
    badge?: string
    onClick: () => void
  }>
}) {
  return (
    <div className="space-y-3">
      {title && (
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
              {title}
            </h4>
            {subtext && (
              <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
            )}
          </div>
          {headerBadge && (
            <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-medium">
              {headerBadge}
            </span>
          )}
          {headerChip && (
            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium border border-primary/20">
              {headerChip}
            </span>
          )}
        </div>
      )}
      <div className="space-y-2">
        {buttons.map((button, index) => (
          <OverviewCard key={index} {...button} />
        ))}
      </div>
    </div>
  )
}

function OverviewCard({
  icon: Icon,
  label,
  subtext,
  variant = 'default',
  badge,
  onClick,
}: {
  icon: React.ElementType
  label: string
  subtext?: string
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'green' | 'blue' | 'pink' | 'orange' | 'purple' | 'gray'
  badge?: string
  onClick: () => void
}) {
  const getVariantStyles = () => {
    // Card itself is always neutral with no border - only icon has color
    return 'bg-transparent hover:bg-muted/50'
  }

  const getIconStyles = () => {
    switch (variant) {
      case 'green':
        return 'bg-[#dcfce7] text-[#15803d]' // emerald-100/700
      case 'blue':
        return 'bg-[#dbeafe] text-[#1d4ed8]' // blue-100/700
      case 'pink':
        return 'bg-[#fce7f3] text-[#be185d]' // pink-100/700
      case 'orange':
        return 'bg-[#ffedd5] text-[#c2410c]' // orange-100/700
      case 'purple':
        return 'bg-[#f3e8ff] text-[#7e22ce]' // purple-100/700
      case 'gray':
        return 'bg-[#1f2937] text-[#f3f4f6]' // gray-800/100
      case 'primary':
        return 'bg-primary/10 text-primary'
      case 'accent':
        return 'bg-[#f3e8ff] text-[#7e22ce]'
      case 'success':
        return 'bg-[#ccfbf1] text-[#0f766e]' // teal-100/700
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left group relative ${getVariantStyles()}`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${getIconStyles()}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-foreground">{label}</div>
          {badge && (
            <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-full font-medium">
              {badge}
            </span>
          )}
        </div>
        {subtext && (
          <div className="text-xs text-muted-foreground mt-0.5 group-hover:text-foreground/80 transition-colors">
            {subtext}
          </div>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </button>
  )
}
