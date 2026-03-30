/**
 * Microsoft365SettingsPage
 *
 * Settings page for managing Microsoft 365 integration.
 * Shows connection status, enabled features, and disconnect option.
 */

import { useState } from 'react'
import { useStore } from '@/store/useStore'
import {
  Calendar,
  Cake,
  BarChart3,
  ListChecks,
  Check,
  Shield,
  Unplug,
  ExternalLink,
  ChevronRight,
  Clock,
  RefreshCw,
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
            ? 'bg-[#0078D4]/10 text-[#0078D4]'
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
          enabled ? 'bg-[#0078D4]' : 'bg-muted-foreground/20'
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

export default function Microsoft365SettingsPage() {
  const {
    microsoft365,
    openMicrosoft365Modal,
    disconnectMicrosoft365,
    updateMicrosoft365Features,
  } = useStore()
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false)
  const [lastSynced] = useState(new Date())

  const handleDisconnect = () => {
    disconnectMicrosoft365()
    setShowDisconnectConfirm(false)
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

  return (
    <div className="max-w-2xl mx-auto py-2 px-6">
      {/* Microsoft 365 Section */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <MicrosoftLogo className="w-7 h-7" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Microsoft 365</h2>
            <p className="text-sm text-muted-foreground">
              Kalendersynk och integrationer
            </p>
          </div>
        </div>

        {microsoft365.connected ? (
          <>
            {/* Connection status card */}
            <div className="bg-[#0078D4]/5 dark:bg-[#0078D4]/10 border border-[#0078D4]/20 rounded-xl p-5 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0078D4] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">EA</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {microsoft365.userName}
                      </p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#7FBA00]/10 text-[#7FBA00] text-[10px] font-semibold uppercase tracking-wider">
                        <Check className="w-3 h-3" />
                        Ansluten
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {microsoft365.userEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sync status */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#0078D4]/10">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  Ansluten sedan {microsoft365.connectedAt ? formatDate(microsoft365.connectedAt) : '—'}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Senaste synk: {formatDate(lastSynced)}
                </div>
              </div>
            </div>

            {/* Feature toggles */}
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-medium text-foreground mb-3">
                Aktiverade funktioner
              </h3>

              <FeatureToggle
                icon={<Calendar className="w-5 h-5" />}
                title="Samtal i Outlook-kalender"
                description="Bokade samtal synkas automatiskt till din Outlook-kalender"
                enabled={microsoft365.features.samtal}
                onChange={(enabled) => updateMicrosoft365Features({ samtal: enabled })}
              />

              <FeatureToggle
                icon={<Cake className="w-5 h-5" />}
                title="Födelsedagar"
                description="Medarbetarnas födelsedagar i en delad Outlook-kalender"
                enabled={microsoft365.features.birthdays}
                onChange={(enabled) => updateMicrosoft365Features({ birthdays: enabled })}
              />

              <FeatureToggle
                icon={<BarChart3 className="w-5 h-5" />}
                title="Undersökningspåminnelser"
                description="Påminnelser för pulsundersökningar i Outlook"
                enabled={microsoft365.features.surveys}
                onChange={(enabled) => updateMicrosoft365Features({ surveys: enabled })}
              />

              <FeatureToggle
                icon={<ListChecks className="w-5 h-5" />}
                title="Arbetsflöden"
                description="Deadlines för onboarding/offboarding i Outlook"
                enabled={microsoft365.features.workflows}
                onChange={(enabled) => updateMicrosoft365Features({ workflows: enabled })}
              />
            </div>

            {/* Security info */}
            <div className="flex items-start gap-3 p-4 bg-muted/30 border border-border rounded-xl mb-6">
              <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Säkerhet</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Workly använder OAuth 2.0 för säker åtkomst. Vi lagrar aldrig ditt Microsoft-lösenord.
                  Du kan när som helst återkalla behörigheter via{' '}
                  <span className="text-foreground font-medium">myapps.microsoft.com</span>.
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
                  Alla synkade kalenderhändelser kommer att finnas kvar i Outlook,
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
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0078D4]/10 to-[#0078D4]/5 dark:from-[#0078D4]/20 dark:to-[#0078D4]/10 flex items-center justify-center mx-auto mb-4">
              <MicrosoftLogo className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">
              Ej ansluten
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Koppla ditt Microsoft 365-konto för att synka samtal, födelsedagar och
              påminnelser till din Outlook-kalender.
            </p>
            <button
              onClick={openMicrosoft365Modal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0078D4] text-white rounded-xl font-medium text-sm hover:bg-[#106EBE] transition-colors shadow-lg shadow-[#0078D4]/20"
            >
              <MicrosoftLogo className="w-4 h-4" />
              Koppla Microsoft 365
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
