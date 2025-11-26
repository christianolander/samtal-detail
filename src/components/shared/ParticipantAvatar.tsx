/**
 * ParticipantAvatar Component
 *
 * Displays user avatar with fallback to initials
 * Supports different sizes and hover tooltip
 */

import type { Participant, User } from '../../types'

interface ParticipantAvatarProps {
  participant: Participant | User
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
}

export default function ParticipantAvatar({
  participant,
  size = 'md',
  showTooltip = true,
}: ParticipantAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const getTooltipContent = () => {
    if ('roleInSamtal' in participant) {
      return `${participant.name} (${participant.roleInSamtal})${participant.title ? ` - ${participant.title}` : ''}`
    }
    if ('role' in participant) {
      return `${participant.name} (${participant.role})`
    }
    return participant.name
  }

  return (
    <div className="relative group">
      <div
        className={`${sizeClasses[size]} rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center border-2 border-background ring-1 ring-border`}
        aria-label={participant.name}
      >
        {participant.avatar ? (
          <img
            src={participant.avatar}
            alt={participant.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span>{getInitials(participant.name)}</span>
        )}
      </div>

      {/* Tooltip on hover */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap pointer-events-none z-50">
          {getTooltipContent()}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="border-4 border-transparent border-t-popover" />
          </div>
        </div>
      )}
    </div>
  )
}
