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
import { useState } from 'react'
import { createPortal } from 'react-dom'

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

export default function ConversationList({ onSelectConversation }: ConversationListProps) {
  const [hoveredParticipants, setHoveredParticipants] = useState<{ id: string, rect: DOMRect } | null>(null)

  return (
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
                  conversation.bookedTime || '—'
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
  )
}
