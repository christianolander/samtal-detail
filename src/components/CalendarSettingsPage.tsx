/**
 * CalendarSettingsPage
 *
 * Settings page for managing calendar integrations.
 * Shows Microsoft 365 (collapsible) and Google Workspace (coming soon).
 * Reads ?sync-error=true URL param to show error state.
 */

import { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import {
  Calendar,
  Cake,
  BarChart3,
  ListChecks,
  Check,
  Shield,
  Unplug,
  ChevronRight,
  ChevronDown,
  Clock,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'

// Microsoft logo SVG
function MicrosoftLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 21 21" fill="none">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  )
}

// Google logo SVG
function GoogleLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

// Feature toggle row
function FeatureToggle({
  icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: React.ReactNode
  title: string
  description: string
  enabled: boolean
  onChange: (enabled: boolean) => void
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl transition-all hover:border-border/80">
      <div
        className={`p-2.5 rounded-lg flex-shrink-0 transition-colors ${
          enabled
            ? 'bg-primary/10 text-primary'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>

      {/* Toggle switch */}
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
          enabled ? 'bg-primary' : 'bg-muted-foreground/20'
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

export default function CalendarSettingsPage() {
  const {
    calendarIntegration,
    openCalendarModal,
    disconnectCalendar,
    updateCalendarFeatures,
    setCalendarSyncStatus,
  } = useStore()
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false)
  const [lastSynced] = useState(new Date())
  const [msExpanded, setMsExpanded] = useState(true)

  // Read URL params for sync error state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('sync-error') === 'true') {
      setCalendarSyncStatus('error')
    }
  }, [setCalendarSyncStatus])

  const handleDisconnect = () => {
    disconnectCalendar()
    setShowDisconnectConfirm(false)
  }

  const handleReconnect = () => {
    // Clear error, disconnect, then open modal to reconnect
    disconnectCalendar()
    openCalendarModal()
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isMs = calendarIntegration.provider === 'microsoft'
  const calendarName = isMs ? 'Outlook' : 'Google Calendar'
  const securityUrl = isMs ? 'myapps.microsoft.com' : 'myaccount.google.com/permissions'
  const isMsConnected = calendarIntegration.connected && calendarIntegration.provider === 'microsoft'
  const hasError = calendarIntegration.syncStatus === 'error'

  return (
    <div className="max-w-2xl mx-auto py-2 px-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-7 h-7 text-primary" />
        <div>
          <h2 className="text-lg font-semibold text-foreground">Integrationer</h2>
          <p className="text-sm text-muted-foreground">
            Kalendersynk och externa tjänster
          </p>
        </div>
      </div>

      {/* Microsoft 365 — Collapsible Card */}
      <section className="mb-4">
        <div
          className={`border rounded-xl overflow-hidden transition-colors ${
            hasError && isMsConnected
              ? 'border-destructive/30'
              : 'border-border'
          }`}
        >
          {/* Card header — always visible */}
          <button
            type="button"
            onClick={() => setMsExpanded(!msExpanded)}
            className="w-full flex items-center gap-4 p-5 text-left hover:bg-muted/30 transition-colors"
          >
            <MicrosoftLogo className="w-7 h-7 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground">Microsoft 365</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Outlook-kalender, Teams och mer
              </p>
            </div>
            {isMsConnected ? (
              <div className="flex items-center gap-2">
                {hasError ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-semibold uppercase tracking-wider">
                    <AlertTriangle className="w-3 h-3" />
                    Synkfel
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider">
                    <Check className="w-3 h-3" />
                    Ansluten
                  </span>
                )}
              </div>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
                Ej ansluten
              </span>
            )}
            {msExpanded ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            )}
          </button>

          {/* Expanded content */}
          {msExpanded && (
            <div className="px-5 pb-5 border-t border-border">
              {isMsConnected ? (
                <>
                  {/* Error banner */}
                  {hasError && (
                    <div className="mt-4 flex items-start gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
                      <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground">
                          Synkfel &mdash; åtgärd krävs
                        </h4>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Vi kunde inte synka med din kalender. Du kan behöva ansluta igen.
                        </p>
                        <button
                          onClick={handleReconnect}
                          className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Anslut igen
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Connection status card */}
                  <div className="mt-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-foreground text-sm font-medium">EA</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">
                              {calendarIntegration.userName}
                            </p>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider">
                              <Check className="w-3 h-3" />
                              Ansluten
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {calendarIntegration.userEmail}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Sync status */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-primary/10">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        Ansluten sedan {calendarIntegration.connectedAt ? formatDate(calendarIntegration.connectedAt) : '\u2014'}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <RefreshCw className="w-3.5 h-3.5" />
                        Senaste synk: {formatDate(lastSynced)}
                      </div>
                    </div>
                  </div>

                  {/* Feature toggles */}
                  <div className="space-y-3 mt-5 mb-5">
                    <h3 className="text-sm font-medium text-foreground mb-3">
                      Aktiverade funktioner
                    </h3>

                    <FeatureToggle
                      icon={<Calendar className="w-5 h-5" />}
                      title={`Samtal i ${calendarName}`}
                      description={`Bokade samtal synkas automatiskt till ${calendarName}`}
                      enabled={calendarIntegration.features.samtal}
                      onChange={(enabled) => updateCalendarFeatures({ samtal: enabled })}
                    />

                    <FeatureToggle
                      icon={<Cake className="w-5 h-5" />}
                      title="Födelsedagar"
                      description={`Medarbetarnas födelsedagar i en delad kalender i ${calendarName}`}
                      enabled={calendarIntegration.features.birthdays}
                      onChange={(enabled) => updateCalendarFeatures({ birthdays: enabled })}
                    />

                    <FeatureToggle
                      icon={<BarChart3 className="w-5 h-5" />}
                      title="Undersökningspåminnelser"
                      description={`Påminnelser för pulsundersökningar i ${calendarName}`}
                      enabled={calendarIntegration.features.surveys}
                      onChange={(enabled) => updateCalendarFeatures({ surveys: enabled })}
                    />

                    <FeatureToggle
                      icon={<ListChecks className="w-5 h-5" />}
                      title="Arbetsflöden"
                      description={`Deadlines för onboarding/offboarding i ${calendarName}`}
                      enabled={calendarIntegration.features.workflows}
                      onChange={(enabled) => updateCalendarFeatures({ workflows: enabled })}
                    />
                  </div>

                  {/* Security info */}
                  <div className="flex items-start gap-3 p-4 bg-muted/30 border border-border rounded-xl mb-5">
                    <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Säkerhet</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Workly använder OAuth 2.0 för säker åtkomst. Vi lagrar aldrig ditt lösenord.
                        Du kan när som helst återkalla behörigheter via{' '}
                        <span className="font-medium text-foreground">{securityUrl}</span>.
                      </p>
                    </div>
                  </div>

                  {/* Disconnect */}
                  {showDisconnectConfirm ? (
                    <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-5">
                      <h4 className="text-sm font-semibold text-foreground mb-2">
                        Koppla från Microsoft 365?
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Alla synkade kalenderhändelser kommer att finnas kvar i {calendarName},
                        men nya samtal synkas inte längre automatiskt.
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowDisconnectConfirm(false)}
                          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Avbryt
                        </button>
                        <button
                          onClick={handleDisconnect}
                          className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                        >
                          Koppla från
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDisconnectConfirm(true)}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Unplug className="w-4 h-4" />
                      Koppla från Microsoft 365
                    </button>
                  )}
                </>
              ) : (
                /* Not connected state */
                <div className="py-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MicrosoftLogo className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    Ej ansluten
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
                    Koppla din Microsoft 365-kalender för att synka samtal, födelsedagar och
                    påminnelser automatiskt.
                  </p>
                  <button
                    onClick={() => openCalendarModal()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                  >
                    <Calendar className="w-4 h-4" />
                    Anslut kalender
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Google Workspace — Coming Soon Card */}
      <section className="mb-8">
        <div className="border border-border rounded-xl opacity-50">
          <div className="flex items-center gap-4 p-5 cursor-not-allowed">
            <GoogleLogo className="w-7 h-7 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">Google Workspace</h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  Kommer snart
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Google Calendar, Meet och mer
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
