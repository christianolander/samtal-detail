import { useStore } from '../../store/useStore'
import { PageTitle, PageHeading } from '@c.olander/proto-ui'
import StatusBadge from '../shared/StatusBadge'
import ParticipantAvatar from '../shared/ParticipantAvatar'
import { ArrowLeft } from 'lucide-react'

interface SamtalHeaderProps {
  onBack?: () => void
}

export default function SamtalHeader({ onBack }: SamtalHeaderProps) {
  const { currentSamtal } = useStore()

  return (
    <PageTitle>
      <PageHeading>
        <div className="flex items-center gap-4" data-tour="detail-header">
          {onBack && (
            <button
              onClick={onBack}
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Tillbaka till samtal"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <span>{currentSamtal.name}</span>
          <StatusBadge status={currentSamtal.status} />
          <div className="h-6 w-px bg-border mx-2" />
          <div className="flex -space-x-2">
            {currentSamtal.participants.map((p) => (
              <div key={p.id} className="relative z-0 hover:z-10 transition-all">
                <ParticipantAvatar participant={p} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </PageHeading>
    </PageTitle>
  )
}
