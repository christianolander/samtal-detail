/**
 * RightPanel Component
 *
 * Fellow-style tabbed panel with contextual tools and information
 * Features: Verktyg, Detaljer, Tidigare samtal, Privata anteckningar
 */

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from '../../store/useStore'
import {
  LayoutGrid,
  Info,
  History,
  Lock,
  Calendar,
  CalendarCheck,
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
  FileText,
} from 'lucide-react'
import StatusDetaljer from './StatusDetaljer'
import RelateradeSamtal from './RelateradeSamtal'
import PrivateNotes from './PrivateNotes'
import TimerTab from './TimerTab'
import FilesTab from './FilesTab'
import { BookingModal } from './BookingSection'
import AutomaticNotesModal from '../modals/AutomaticNotesModal'
import MarkAsKlarModal from '../modals/MarkAsKlarModal'

type TabId = 'översikt' | 'detaljer' | 'timer' | 'tidigare' | 'privata' | 'filer'

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
    setBooking,
    uploadedFiles,
    automaticNotesModalOpen,
    openAutomaticNotesModal,
    closeAutomaticNotesModal,
  } = useStore()
  const activeTabId = activeRightPanelTab
  const setActiveTabId = setActiveRightPanelTab
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showMarkAsKlarModal, setShowMarkAsKlarModal] = useState(false)

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
    {
      id: 'filer',
      label: 'Filer',
      icon: FileText,
      count: uploadedFiles.length > 0 ? uploadedFiles.length : undefined,
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
              <div className="flex flex-col">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Dags att boka ditt samtal!
                </h4>
                <p className="text-sm text-muted-foreground mb-5">
                  Samtalet ska genomföras senast{' '}
                  <span className="font-medium text-foreground">
                    {currentSamtal.deadlineDate.toLocaleDateString('sv-SE', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </p>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Boka samtal
                </button>
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
            {/* Friendly booking info card */}
            <div
              className="bg-muted/30 border border-border rounded-lg p-6 group relative cursor-pointer hover:border-muted-foreground/30 transition-colors"
              onClick={() => setShowBookingModal(true)}
            >
              {/* Edit hint on hover */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-muted-foreground font-medium">Redigera</span>
              </div>

              <div className="flex flex-col">
                <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center mb-4">
                  <CalendarCheck className="w-6 h-6 text-foreground" />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  {(() => {
                    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                    const eventDate = new Date(bookedDate.getFullYear(), bookedDate.getMonth(), bookedDate.getDate())
                    const diffTime = eventDate.getTime() - nowDate.getTime()
                    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

                    if (diffDays === 0) return 'Samtalet är idag'
                    if (diffDays === 1) return 'Samtalet är imorgon'
                    if (diffDays > 1) return `Samtalet är om ${diffDays} dagar`
                    return 'Samtalet är bokat'
                  })()}
                </h4>
                <p className="text-sm text-muted-foreground mb-1">
                  {bookedDate.toLocaleDateString('sv-SE', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  }).replace(/^\w/, c => c.toUpperCase())} kl. {formatTime(bookedDate)}
                </p>
                {currentSamtal.metadata.location && (
                  <p className="text-sm text-muted-foreground">
                    {currentSamtal.metadata.location}
                  </p>
                )}
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
                  variant: 'blue',
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
                  variant: 'blue',
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
                  <p className="text-sm text-muted-foreground mb-3">
                    Är samtalet genomfört och dokumenterat? Markera den då som klar.
                  </p>
                  <button
                    onClick={() => setShowMarkAsKlarModal(true)}
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
                  icon: Sparkles,
                  label: 'Automatiska anteckningar',
                  subtext: 'Skapa dokumentering från handskrivna anteckningar.',
                  variant: 'purple',
                  onClick: openAutomaticNotesModal,
                },
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
                  variant: 'blue',
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
              <p className="text-sm text-foreground">
                Sammanfattning har skickats ut till alla deltagare.
              </p>
            </div>

            <ToolSection
              buttons={[
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
      case 'filer':
        return <FilesTab />
    }
  }

  // Collapsed state - show vertical rail of tab icons (Fellow-style)
  if (rightPanelCollapsed) {
    const handleTabClick = (tabId: TabId) => {
      setActiveTabId(tabId)
      toggleRightPanel() // Expand when clicking a tab
    }

    return (
      <div className="flex flex-col items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="relative p-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors group"
              title={tab.label}
            >
              <Icon className="w-5 h-5" />
              {/* Notification dot for private notes */}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
              )}
              {/* Tooltip on hover */}
              <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  // Expanded state - tabs above panel with minimize button to right
  return (
    <div className="flex flex-col">
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
      <div className="bg-card border border-border rounded-lg p-4">
        {renderTabContent()}
      </div>

      {/* Booking Modal */}
      {showBookingModal &&
        createPortal(
          <BookingModal
            isOpen={showBookingModal}
            onClose={() => setShowBookingModal(false)}
            onSave={(date, duration, location, meetingLink) => {
              setBooking(date, duration, location, meetingLink)
              setShowBookingModal(false)
            }}
          />,
          document.body
        )}

      {/* Automatic Notes Modal */}
      {automaticNotesModalOpen &&
        createPortal(
          <AutomaticNotesModal
            isOpen={automaticNotesModalOpen}
            onClose={closeAutomaticNotesModal}
          />,
          document.body
        )}

      {/* Mark as Klar Modal */}
      <MarkAsKlarModal
        isOpen={showMarkAsKlarModal}
        onClose={() => setShowMarkAsKlarModal(false)}
      />
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
      className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left group relative ${getVariantStyles()}`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${getIconStyles()}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-foreground">{label}</div>
          {badge && (
            <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-full font-medium">
              {badge}
            </span>
          )}
        </div>
        {subtext && (
          <div className="text-sm text-muted-foreground mt-0.5 group-hover:text-foreground/80 transition-colors">
            {subtext}
          </div>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </button>
  )
}
