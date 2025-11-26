import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from '@/store/useStore'
import ParticipantAvatar from '../shared/ParticipantAvatar'
import { Search, Settings, Trash2, ChevronDown, Check } from 'lucide-react'
import type { Participant } from '@/types'

interface AddParticipantModalProps {
  isOpen: boolean
  onClose: () => void
}

const ROLES = [
  {
    value: 'Ansvarig',
    label: 'Ansvarig',
    subLabel: '(upptagen)',
    description: 'Leder samtalet, ansvarar för bokning',
  },
  {
    value: 'Medarbetare',
    label: 'Medarbetare',
    description: 'Fokus för samtalet, kan läsa agendan',
  },
  {
    value: 'Redaktör',
    label: 'Redaktör',
    description: 'Kan redigera agenda och dokumentera',
  },
  {
    value: 'Deltagare',
    label: 'Deltagare',
    description: 'Har endast läsbehörighet',
  },
] as const

const MOCK_USERS: Participant[] = [
  {
    id: '3',
    name: 'Anna Andersson',
    title: 'HR Manager, Human Resources',
    email: 'anna@workly.se',
    roleInSamtal: 'Deltagare',
  },
  {
    id: '4',
    name: 'Johan Johansson',
    title: 'Senior Developer, Tech',
    email: 'johan@workly.se',
    roleInSamtal: 'Deltagare',
  },
  {
    id: '5',
    name: 'Maria Nilsson',
    title: 'Product Owner, Product',
    email: 'maria@workly.se',
    roleInSamtal: 'Redaktör',
  },
]

export default function AddParticipantModal({ isOpen, onClose }: AddParticipantModalProps) {
  const { currentSamtal, setParticipants } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Participant[]>([])
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [localParticipants, setLocalParticipants] = useState<Participant[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null)
  
  const modalRef = useRef<HTMLDivElement>(null)
  const dropdownButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalParticipants(currentSamtal.participants)
      setIsSearching(false)
    }
  }, [isOpen, currentSamtal.participants])

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      return () => window.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openDropdownId && !(e.target as Element).closest('.role-dropdown-content') && !(e.target as Element).closest('.role-dropdown-trigger')) {
        setOpenDropdownId(null)
      }
    }
    window.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', () => setOpenDropdownId(null), true) // Close on scroll
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', () => setOpenDropdownId(null), true)
    }
  }, [openDropdownId])

  // Update dropdown position when opening
  useEffect(() => {
    if (openDropdownId && dropdownButtonRefs.current[openDropdownId]) {
      const rect = dropdownButtonRefs.current[openDropdownId]?.getBoundingClientRect()
      if (rect) {
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: 288 // w-72
        })
      }
    }
  }, [openDropdownId])

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    
    const query = searchQuery.toLowerCase()
    const existingIds = localParticipants.map(p => p.id)
    
    const results = MOCK_USERS.filter(user => 
      !existingIds.includes(user.id) && 
      (user.name.toLowerCase().includes(query) || user.title?.toLowerCase().includes(query))
    )
    
    setSearchResults(results)
  }, [searchQuery, localParticipants])

  const handleAddUser = (user: Participant) => {
    setLocalParticipants(prev => [...prev, user])
    setSearchQuery('')
    setSearchResults([])
    setIsSearching(false)
  }

  const handleRemoveUser = (userId: string) => {
    setLocalParticipants(prev => prev.filter(p => p.id !== userId))
  }

  const handleUpdateRole = (userId: string, role: Participant['roleInSamtal']) => {
    setLocalParticipants(prev => prev.map(p => 
      p.id === userId ? { ...p, roleInSamtal: role } : p
    ))
  }

  const handleSave = () => {
    setParticipants(localParticipants)
    onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-card border border-border rounded-xl shadow-lg w-full max-w-2xl max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-2">
          <h2 className="text-xl font-semibold text-foreground">Deltagare</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-6 pb-6">
          {/* Search Section */}
          <div className="space-y-2">
            {!isSearching ? (
              <div className="flex justify-end">
                <button
                  onClick={() => setIsSearching(true)}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors px-1 py-1"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg leading-none mb-0.5">+</span>
                  </div>
                  Lägg till deltagare
                </button>
              </div>
            ) : (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground ml-1">
                    Sök efter namn eller titel
                  </label>
                  <button 
                    onClick={() => {
                      setIsSearching(false)
                      setSearchQuery('')
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Avbryt
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Sök..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-9 pr-4 py-2.5 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  
                  {/* Search Results Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-20 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                      {searchResults.map(user => (
                        <button
                          key={user.id}
                          onClick={() => handleAddUser(user)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-accent/50 transition-colors text-left"
                        >
                          <ParticipantAvatar participant={user} size="sm" showTooltip={false} />
                          <div>
                            <p className="text-sm font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.title}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Participants List */}
          <div className="space-y-2">
            {localParticipants.map((participant, index) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-3 bg-white border border-border rounded-xl shadow-sm animate-in slide-in-from-top-2 fade-in duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* User Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <ParticipantAvatar participant={participant} size="md" showTooltip={false} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {participant.name}
                      </p>
                      {participant.roleInSamtal === 'Ansvarig' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-medium rounded-full">
                          <Check className="w-3 h-3" />
                          Ansvarig
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {participant.title || 'No title'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Role Dropdown */}
                  <div>
                    <button
                      ref={el => dropdownButtonRefs.current[participant.id] = el}
                      onClick={() => setOpenDropdownId(openDropdownId === participant.id ? null : participant.id)}
                      className="role-dropdown-trigger flex items-center justify-between w-36 px-2.5 py-1.5 bg-background border border-input rounded-lg text-xs hover:bg-accent/50 transition-colors"
                    >
                      <span className="truncate">{participant.roleInSamtal}</span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground ml-2" />
                    </button>
                  </div>

                  {/* Settings Button */}
                  <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleRemoveUser(participant.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    disabled={participant.roleInSamtal === 'Ansvarig'} // Prevent deleting owner?
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-border bg-card flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
          >
            Avbryt
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
          >
            Spara
          </button>
        </div>
      </div>

      {/* Portal for Dropdown */}
      {openDropdownId && dropdownPosition && createPortal(
        <div 
          className="fixed role-dropdown-content bg-popover border border-border rounded-lg shadow-xl z-[10000] overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          style={{
            top: dropdownPosition.top + 4,
            left: dropdownPosition.left - (dropdownPosition.width - 144), // Align right edge roughly
            width: dropdownPosition.width
          }}
        >
          {ROLES.map((role) => (
            <button
              key={role.value}
              onClick={() => {
                handleUpdateRole(openDropdownId, role.value)
                setOpenDropdownId(null)
              }}
              className="w-full text-left p-3 hover:bg-accent/50 transition-colors flex items-start gap-3"
            >
              <div className="mt-0.5">
                {localParticipants.find(p => p.id === openDropdownId)?.roleInSamtal === role.value && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {role.label} <span className="text-muted-foreground font-normal">{'subLabel' in role ? role.subLabel : ''}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {role.description}
                </p>
              </div>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>,
    document.body
  )
}
