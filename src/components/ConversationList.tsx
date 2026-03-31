import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@c.olander/proto-ui'
import { mockConversationList, type ConversationListItem } from '../lib/mockData'
import ParticipantAvatar from './shared/ParticipantAvatar'
import { useStore } from '../store/useStore'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Calendar, ChevronRight, Check, X } from 'lucide-react'

interface ConversationListProps {
  onSelectConversation: (id: string) => void
}

// Status badge component
function StatusBadge({ status }: { status: ConversationListItem['status'] }) {
  const styles = {
    'Ej bokad': 'bg-muted text-muted-foreground',
    Genomförd: 'bg-sea-green/10 text-sea-green',
    Bokad: 'bg-cornflower-blue/10 text-cornflower-blue',
    Planerad: 'bg-purple-100 text-purple-600',
  }

  const icons = {
    'Ej bokad': '⏱',
    Genomförd: '✓',
    Bokad: '📅',
    Planerad: '📝',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      <span>{icons[status]}</span>
      {status}
    </span>
  )
}

// Icon component for conversation type
function ConversationIcon({ icon }: { icon: string }) {
  const bgColors: Record<string, string> = {
    $: 'bg-green-100 text-green-600',
    '📋': 'bg-blue-100 text-blue-600',
  }

  return (
    <div
      className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        bgColors[icon] || 'bg-muted'
      }`}
    >
      <span className="text-lg">{icon}</span>
    </div>
  )
}

// Microsoft Logo inline
function MicrosoftLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 21 21" fill="none">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  )
}

// Workly droid icon
function WorklyDroid({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 74 102" fill="none">
      <path d="M33 42.9361C42.7202 42.9361 50.6 36.8024 50.6 29.2361C50.6 21.6698 42.7202 15.5361 33 15.5361C23.2798 15.5361 15.4 21.6698 15.4 29.2361C15.4 36.8024 23.2798 42.9361 33 42.9361Z" fill="white" />
      <path fillRule="evenodd" clipRule="evenodd" d="M10.5 37.8361C10.5 42.1361 14 45.5361 18.2 45.5361H55.5C59.8 45.5361 63.3 42.0361 63.3 37.7361V36.7361C63.3 36.1361 63.2 35.5361 63.2 35.0361C61.9 22.3361 51.7 12.2361 38.8 11.3361V7.83613C40.4 7.03613 41.4 5.13613 40.9 3.13613C40.6 1.73613 39.4 0.536129 38 0.136129C35.2 -0.563871 32.7 1.53613 32.7 4.13613C32.7 5.73613 33.6 7.13613 34.9 7.83613V11.4361C22 12.3361 11.7 22.5361 10.5 35.3361C10.4 35.8361 10.4 36.3361 10.4 36.8361V37.6361C10.5 37.7361 10.5 37.7361 10.5 37.8361ZM28.1 33.1361C24.2 24.8361 32.7 16.4361 40.9 20.3361C42.9 21.3361 44.6 23.0361 45.6 25.0361C49.5 33.3361 41 41.7361 32.8 37.8361C30.8 36.9361 29.1 35.2361 28.1 33.1361Z" fill="#63C0A8" />
      <path fillRule="evenodd" clipRule="evenodd" d="M41.4 27.2361C39.8 27.2361 38.5 25.9361 38.5 24.3361C38.5 23.6361 38.8 22.9361 39.2 22.4361C38.4 22.1361 37.6 22.0361 36.8 22.0361C32.9 22.0361 29.8 25.2361 29.8 29.0361C29.8 32.9361 33 36.0361 36.8 36.0361C40.7 36.0361 43.8 32.8361 43.8 29.0361C43.8 28.1361 43.6 27.2361 43.3 26.4361C42.9 26.9361 42.2 27.2361 41.4 27.2361Z" fill="#343043" />
      <path d="M73.5 81.5C73.4 80.6 73.2 79.7 73.1 78.8C71.9 73.3 70.7 67.6 68.4 62.5C68.3 62.1 68.1 61.8 68 61.4C67.3 59.6 66.5 57.8 65.7 56.1C63.9 52.4 60.2 50 56.1 50H55.4H40.4C40.4 50.1 40.5 50.1 40.5 50.1C48.8 64.3 44.8 77.4 43.9 80.1C43.8 80.4 43.5 80.7 43.2 80.9L34.7 85.5C34.4 85.7 33.9 85.6 33.8 85.2C33 83.7 31 79.8 30.2 78.2C30 77.8 30 77.3 30.2 76.9C38.9 59.6 35.5 52.5 33.1 50H32.8H29.4H19H17.8C13.7 50 9.9 52.4 8.2 56.1C7.4 57.8 6.6 59.6 5.9 61.4C5.8 61.8 5.6 62.1 5.5 62.5C3.1 67.7 1.9 73.3 0.7 78.8C0.5 79.7 0.4 80.6 0.3 81.5C0 83.3 0 85.2 0 87.1C0.1 89.1 1.6 90.9 3.6 91.2C6.5 91.7 9.2 87.5 10.7 84.1C11.1 83.1 11.5 82 11.9 80.9C17.2 92.1 25.6 101.8 37 101.8C47.8 101.8 56.2 92.3 61.6 81.2C61.7 81.1 61.7 81 61.8 80.8C62.2 81.9 62.5 83 63 84C64.5 87.3 67.2 91.5 70.1 91.1C70.2 91.1 70.3 91.1 70.3 91C72.2 90.6 73.6 88.9 73.7 86.9C73.8 85.2 73.7 83.3 73.5 81.5Z" fill="#63C0A8" />
    </svg>
  )
}

// Calendar sync badge for booked conversations
function CalendarSyncBadge({ connected, provider }: { connected: boolean, provider?: 'microsoft' | 'google' }) {
  if (!connected) return null
  const label = provider === 'google' ? 'Google' : 'Outlook'
  return (
    <span className="inline-flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
      <Check className="w-2.5 h-2.5" />
      {label}
    </span>
  )
}

// Integration banner component
function IntegrationBanner({ onConnect, onDismiss }: { onConnect: () => void, onDismiss: () => void }) {
  return (
    <div className="mb-4 relative overflow-hidden bg-gradient-to-r from-primary/5 via-primary/8 to-primary/5 dark:from-primary/10 dark:via-primary/15 dark:to-primary/10 border border-primary/15 rounded-xl p-4 wizard-fade-in">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 border border-primary/10 shadow-sm flex-shrink-0">
          <Calendar className="w-7 h-7 text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            Kalenderintegration
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
              Nytt
            </span>
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Synka samtal automatiskt till din kalender — Microsoft eller Google.
          </p>
        </div>

        {/* CTA + Dismiss */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onConnect}
            className="flex items-center gap-2 px-4 py-2 border border-foreground/20 text-foreground rounded-lg text-sm font-medium hover:bg-foreground/5 transition-colors"
          >
            Synka
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDismiss}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ConversationList({ onSelectConversation }: ConversationListProps) {
  const { calendarIntegration, openCalendarModal } = useStore()
  const [hoveredParticipants, setHoveredParticipants] = useState<{ id: string, rect: DOMRect } | null>(null)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  return (
    <div>
      {/* Integration banner - show when not connected and not dismissed */}
      {!calendarIntegration.connected && !bannerDismissed && (
        <IntegrationBanner
          onConnect={openCalendarModal}
          onDismiss={() => setBannerDismissed(true)}
        />
      )}

    <div className="bg-card rounded-lg border border-border/40 overflow-hidden" data-tour="list-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Namn</TableHead>
            <TableHead>Deltagare</TableHead>
            <TableHead>Typ av samtal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Bokad tid</TableHead>
            <TableHead>Genomför senast</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockConversationList
            .sort((a, b) => {
              const priority = {
                'Ej bokad': 0,
                'Planerad': 1,
                'Bokad': 2,
                'Genomförd': 3
              }
              return (priority[a.status as keyof typeof priority] ?? 99) - (priority[b.status as keyof typeof priority] ?? 99)
            })
            .map((conversation) => (
            <TableRow
              key={conversation.id}
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => onSelectConversation(conversation.id)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <ConversationIcon icon={conversation.icon} />
                  <div>
                    <div className="font-medium text-foreground">{conversation.name}</div>
                    {conversation.conversationRoundName && (
                      <div className="text-xs text-muted-foreground">{conversation.conversationRoundName}</div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-foreground">
                <div 
                  className="flex -space-x-2 relative"
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    setHoveredParticipants({ id: conversation.id, rect })
                  }}
                  onMouseLeave={() => setHoveredParticipants(null)}
                >
                  {conversation.participants.map((p) => (
                    <div key={p.id} className="relative z-0 hover:z-10 transition-all">
                      <ParticipantAvatar participant={p} size="sm" showTooltip={false} />
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-sm text-foreground">{conversation.type}</TableCell>
              <TableCell>
                <StatusBadge status={conversation.status} />
              </TableCell>
              <TableCell className="text-sm text-foreground">
                {conversation.status === 'Ej bokad' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // Void action for now
                    }}
                    className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Boka tid
                  </button>
                ) : (
                  <span className="inline-flex items-center">
                    {conversation.bookedTime || '—'}
                    {conversation.status === 'Bokad' && calendarIntegration.connected && calendarIntegration.features.samtal && (
                      <CalendarSyncBadge connected={true} provider={calendarIntegration.provider} />
                    )}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-sm text-foreground">{conversation.deadline}</TableCell>
              <TableCell className="text-right">
                <button
                  className="text-sm text-primary hover:underline"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectConversation(conversation.id)
                  }}
                >
                  Visa
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Participants Popover */}
      {hoveredParticipants && createPortal(
        <div
          className="fixed z-[9999] bg-popover border border-border rounded-lg shadow-xl p-3 min-w-[250px] animate-in fade-in zoom-in-95 duration-150 pointer-events-none"
          style={{
            top: hoveredParticipants.rect.bottom + 8,
            left: hoveredParticipants.rect.left,
          }}
        >
          <div className="space-y-3">
            {mockConversationList
              .find(c => c.id === hoveredParticipants.id)
              ?.participants.map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <ParticipantAvatar participant={p} size="sm" showTooltip={false} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.title}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{p.roleInSamtal}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>,
        document.body
      )}
    </div>
    </div>
  )
}
