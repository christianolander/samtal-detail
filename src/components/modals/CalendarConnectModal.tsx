/**
 * CalendarConnectModal
 *
 * Multi-step wizard for connecting a calendar provider (Microsoft 365 or Google):
 * Step 1: Welcome - choose provider
 * Step 2: Feature selection - checkboxes for which integrations to enable (optional, controlled by showAllFeatures prop)
 * Step 3: Simulated auth popup
 * Step 4: Success confirmation with animation
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from '@/store/useStore'
import {
  X,
  Calendar,
  Cake,
  BarChart3,
  ListChecks,
  Check,
  ChevronRight,
  ChevronLeft,
  Shield,
  Loader2,
  Sparkles,
  ExternalLink,
  Lock,
} from 'lucide-react'
import type { CalendarIntegration, CalendarProvider } from '@/types'

type WizardStep = 'welcome' | 'features' | 'auth' | 'success'

// Microsoft logo SVG component
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

// Google logo SVG component
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

// Workly droid icon (extracted from WorklyLogo in proto-ui)
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

// Provider selection card
function ProviderCard({
  provider,
  selected,
  onClick,
  comingSoon,
}: {
  provider: CalendarProvider
  selected: boolean
  onClick: () => void
  comingSoon?: boolean
}) {
  const isMs = provider === 'microsoft'
  return (
    <button
      type="button"
      onClick={comingSoon ? undefined : onClick}
      disabled={comingSoon}
      className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 group ${
        comingSoon
          ? 'border-border bg-card opacity-50 cursor-not-allowed'
          : selected
          ? 'border-primary bg-primary/5 dark:bg-primary/10 cursor-pointer'
          : 'border-border hover:border-primary/30 bg-card cursor-pointer'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-lg flex-shrink-0 transition-colors ${
          selected && !comingSoon ? 'bg-primary/10' : 'bg-muted'
        }`}>
          {isMs ? <MicrosoftLogo className="w-7 h-7" /> : <GoogleLogo className="w-7 h-7" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">
              {isMs ? 'Microsoft 365' : 'Google Workspace'}
            </h4>
            {comingSoon && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                Kommer snart
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isMs ? 'Outlook-kalender, Teams och mer' : 'Google Calendar, Meet och mer'}
          </p>
        </div>
        {!comingSoon && (
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            selected ? 'bg-primary border-primary' : 'border-muted-foreground/30'
          }`}>
            {selected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
          </div>
        )}
      </div>
    </button>
  )
}

// Illustration for the welcome step
function WelcomeIllustration({ provider }: { provider: CalendarProvider }) {
  const isMs = provider === 'microsoft'
  return (
    <div className="relative w-full h-48 flex items-center justify-center overflow-hidden">
      {/* Background gradient circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/5 animate-pulse" style={{ animationDuration: '3s' }} />
      </div>

      {/* Floating cards */}
      <div className="relative flex items-center gap-4">
        {/* Workly card */}
        <div className="relative z-10 bg-card border border-border rounded-xl p-4 shadow-lg wizard-float" style={{ animationDelay: '0s' }}>
          <div className="flex items-center gap-2 mb-2">
            <WorklyDroid className="w-8 h-8" />
            <span className="text-sm font-semibold text-foreground">Workly</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-24 bg-muted rounded-full" />
            <div className="h-2 w-16 bg-muted rounded-full" />
          </div>
        </div>

        {/* Connection arrow */}
        <div className="flex flex-col items-center gap-1 wizard-pulse">
          <div className="flex items-center gap-0.5">
            <div className="w-3 h-0.5 bg-primary rounded-full" />
            <div className="w-3 h-0.5 bg-primary rounded-full" />
            <div className="w-3 h-0.5 bg-primary rounded-full" />
            <ChevronRight className="w-4 h-4 text-primary" />
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">SYNKAR</span>
          <div className="flex items-center gap-0.5">
            <ChevronLeft className="w-4 h-4 text-primary" />
            <div className="w-3 h-0.5 bg-primary rounded-full" />
            <div className="w-3 h-0.5 bg-primary rounded-full" />
            <div className="w-3 h-0.5 bg-primary rounded-full" />
          </div>
        </div>

        {/* Provider card */}
        <div className="relative z-10 bg-card border border-border rounded-xl p-4 shadow-lg wizard-float" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-2 mb-2">
            {isMs ? <MicrosoftLogo className="w-7 h-7" /> : <GoogleLogo className="w-7 h-7" />}
            <span className="text-sm font-semibold text-foreground">
              {isMs ? 'Microsoft 365' : 'Google'}
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded ${isMs ? 'bg-[#0078D4]' : 'bg-[#4285F4]'}`} />
              <div className="h-2 w-16 bg-muted rounded-full" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded ${isMs ? 'bg-[#7FBA00]' : 'bg-[#34A853]'}`} />
              <div className="h-2 w-12 bg-muted rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Feature card component
function FeatureCard({
  icon,
  title,
  description,
  checked,
  onChange,
  recommended,
}: {
  icon: React.ReactNode
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
  recommended?: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group ${
        checked
          ? 'border-primary bg-primary/5 dark:bg-primary/10'
          : 'border-border hover:border-primary/30 bg-card'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div
          className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            checked
              ? 'bg-primary border-primary'
              : 'border-muted-foreground/30 group-hover:border-primary/50'
          }`}
        >
          {checked && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
        </div>

        {/* Icon */}
        <div
          className={`p-2 rounded-lg flex-shrink-0 transition-colors ${
            checked
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
            {recommended && (
              <span className="text-xs font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                Rekommenderas
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </button>
  )
}

// Simulated auth popup
function AuthSimulation({
  provider,
  onComplete,
  onCancel,
}: {
  provider: CalendarProvider
  onComplete: () => void
  onCancel: () => void
}) {
  const isMs = provider === 'microsoft'
  const [authStep, setAuthStep] = useState<'loading' | 'consent' | 'signing-in'>('loading')

  useEffect(() => {
    // Simulate loading
    const loadTimer = setTimeout(() => setAuthStep('consent'), 1200)
    return () => clearTimeout(loadTimer)
  }, [])

  const handleAccept = () => {
    setAuthStep('signing-in')
    setTimeout(onComplete, 1800)
  }

  const accentColor = isMs ? '#0078D4' : '#4285F4'

  return (
    <div className="flex flex-col items-center">
      {/* Simulated browser popup */}
      <div className="w-full max-w-sm mx-auto">
        {/* Browser chrome */}
        <div className="bg-[#f3f3f3] dark:bg-zinc-800 rounded-t-xl border border-border border-b-0 px-3 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <button
              onClick={onCancel}
              className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors"
            />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-700 rounded-md px-3 py-1 text-[11px] text-muted-foreground max-w-[240px]">
              <Lock className="w-3 h-3 text-green-600 flex-shrink-0" />
              <span className="truncate">
                {isMs ? 'login.microsoftonline.com' : 'accounts.google.com'}
              </span>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="bg-white dark:bg-zinc-900 rounded-b-xl border border-border p-6">
          {authStep === 'loading' && (
            <div className="flex flex-col items-center justify-center py-8 wizard-fade-in">
              {isMs ? <MicrosoftLogo className="w-10 h-10 mb-4" /> : <GoogleLogo className="w-10 h-10 mb-4" />}
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: accentColor }} />
              <p className="text-sm text-muted-foreground mt-3">Laddar...</p>
            </div>
          )}

          {authStep === 'consent' && (
            <div className="wizard-fade-in">
              <div className="flex items-center justify-center mb-4">
                {isMs ? <MicrosoftLogo className="w-8 h-8" /> : <GoogleLogo className="w-8 h-8" />}
              </div>
              <h3 className="text-center text-sm font-semibold text-foreground mb-1">
                Logga in
              </h3>
              <p className="text-center text-sm text-muted-foreground mb-5">
                Workly vill komma åt ditt {isMs ? 'Microsoft 365' : 'Google'}-konto
              </p>

              {/* Mock email input */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-lg border border-border">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: accentColor }}>
                    <span className="text-white text-xs font-medium">EA</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Erik Axelsson</p>
                    <p className="text-xs text-muted-foreground">erik.axelsson@workly.se</p>
                  </div>
                  <Check className="w-4 h-4" style={{ color: accentColor }} />
                </div>
              </div>

              {/* Permissions */}
              <div className="bg-muted/30 rounded-lg p-3 mb-5 border border-border/50">
                <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" style={{ color: accentColor }} />
                  Workly begär behörigheter:
                </p>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                    Läsa och skriva i din kalender
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                    Läsa din profil och kontaktuppgifter
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                    Skicka kalenderinbjudningar
                  </li>
                </ul>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2.5 text-sm font-medium border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors"
                  style={{ backgroundColor: accentColor }}
                >
                  Godkänn
                </button>
              </div>
            </div>
          )}

          {authStep === 'signing-in' && (
            <div className="flex flex-col items-center justify-center py-8 wizard-fade-in">
              {isMs ? <MicrosoftLogo className="w-10 h-10 mb-4" /> : <GoogleLogo className="w-10 h-10 mb-4" />}
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: accentColor }} />
                <span className="text-sm font-medium text-foreground">Ansluter...</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Kopplar Workly till ditt {isMs ? 'Microsoft 365' : 'Google'}-konto
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Success celebration with confetti
function SuccessView({ features, provider }: { features: CalendarIntegration['features'], provider: CalendarProvider }) {
  const isMs = provider === 'microsoft'
  const calendarName = isMs ? 'Outlook' : 'Google Calendar'

  const enabledFeatures = Object.entries(features)
    .filter(([, enabled]) => enabled)
    .map(([key]) => {
      const labels: Record<string, { label: string; icon: React.ReactNode }> = {
        samtal: { label: `Samtal i ${calendarName}`, icon: <Calendar className="w-4 h-4" /> },
        birthdays: { label: `Födelsedagar i ${calendarName}`, icon: <Cake className="w-4 h-4" /> },
        surveys: { label: 'Undersökningspåminnelser', icon: <BarChart3 className="w-4 h-4" /> },
        workflows: { label: 'Arbetsflödesuppgifter', icon: <ListChecks className="w-4 h-4" /> },
      }
      return labels[key]
    })

  return (
    <div className="flex flex-col items-center text-center wizard-fade-in">
      {/* Confetti burst - full width */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => {
          const colors = ['var(--color-primary)', '#0078D4', '#FFB900', '#F25022', '#7FBA00', '#00A4EF']
          const size = 4 + Math.random() * 6
          const startX = 40 + Math.random() * 20
          const angle = (Math.random() - 0.5) * 3
          const distance = 80 + Math.random() * 200
          const shapes = ['rounded-full', 'rounded-sm']
          return (
            <div
              key={i}
              className={`absolute ${shapes[i % 2]} wizard-confetti-burst`}
              style={{
                width: `${size}px`,
                height: `${size * (0.6 + Math.random() * 0.8)}px`,
                backgroundColor: colors[i % colors.length],
                left: `${startX}%`,
                top: '30%',
                animationDelay: `${Math.random() * 0.3}s`,
                animationDuration: `${0.8 + Math.random() * 0.6}s`,
                '--confetti-x': `${angle * distance}px`,
                '--confetti-y': `${distance}px`,
                '--confetti-r': `${(Math.random() - 0.5) * 720}deg`,
              } as React.CSSProperties}
            />
          )
        })}
      </div>

      {/* Success animation */}
      <div className="relative mb-6">
        {/* Glow ring */}
        <div className="absolute inset-0 -m-3 rounded-full bg-primary/20 wizard-success-glow" />

        {/* Success icon -- primary green */}
        <div className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center wizard-success-pop">
          <Check className="w-10 h-10 text-primary-foreground" strokeWidth={3} />
        </div>
      </div>

      <h2 className="text-xl font-bold text-foreground mb-2">
        Kopplat!
      </h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        Ditt {isMs ? 'Microsoft 365' : 'Google'}-konto är nu anslutet. Följande funktioner är aktiverade:
      </p>

      {/* Enabled features list */}
      <div className="w-full max-w-xs space-y-2 mb-6">
        {enabledFeatures.map((feature, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg wizard-slide-up"
            style={{ animationDelay: `${0.3 + i * 0.1}s` }}
          >
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              {feature.icon}
            </div>
            <span className="text-sm font-medium text-foreground">{feature.label}</span>
            <Check className="w-4 h-4 text-primary ml-auto" />
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Du kan ändra dessa inställningar när som helst under{' '}
        <span className="font-medium text-foreground">Inställningar</span>.
      </p>
    </div>
  )
}

interface CalendarConnectModalProps {
  showAllFeatures?: boolean
}

export default function CalendarConnectModal({ showAllFeatures = false }: CalendarConnectModalProps) {
  const { calendarModalOpen, closeCalendarModal, connectCalendar, calendarModalPreselectedProvider } = useStore()
  const [step, setStep] = useState<WizardStep>('welcome')
  const [selectedProvider, setSelectedProvider] = useState<CalendarProvider>('microsoft')
  const [features, setFeatures] = useState<CalendarIntegration['features']>({
    samtal: true,
    birthdays: false,
    surveys: false,
    workflows: false,
  })
  const [isExiting, setIsExiting] = useState(false)

  // Build STEPS array dynamically
  const hasPreselected = !!calendarModalPreselectedProvider
  const steps = useMemo<WizardStep[]>(() => {
    const base: WizardStep[] = hasPreselected
      ? ['auth', 'success'] // Skip welcome when provider is known
      : showAllFeatures
        ? ['welcome', 'features', 'auth', 'success']
        : ['welcome', 'auth', 'success']
    return base
  }, [showAllFeatures, hasPreselected])

  // Reset state when modal opens
  useEffect(() => {
    if (calendarModalOpen) {
      if (calendarModalPreselectedProvider) {
        setSelectedProvider(calendarModalPreselectedProvider)
        setStep('auth')
      } else {
        setStep('welcome')
        setSelectedProvider('microsoft')
      }
      setFeatures({
        samtal: true,
        birthdays: false,
        surveys: false,
        workflows: false,
      })
      setIsExiting(false)
    }
  }, [calendarModalOpen, calendarModalPreselectedProvider])

  const handleClose = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      closeCalendarModal()
      setIsExiting(false)
    }, 200)
  }, [closeCalendarModal])

  const handleNext = () => {
    const currentIndex = steps.indexOf(step)
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const currentIndex = steps.indexOf(step)
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1])
    }
  }

  const handleAuthComplete = () => {
    setStep('success')
  }

  const handleFinish = () => {
    connectCalendar(selectedProvider, 'erik.axelsson@workly.se', 'Erik Axelsson', features)
  }

  const atLeastOneFeatureEnabled = Object.values(features).some(Boolean)
  const stepIndex = steps.indexOf(step)

  const isMs = selectedProvider === 'microsoft'
  const providerName = isMs ? 'Microsoft 365' : 'Google'
  const calendarName = isMs ? 'Outlook' : 'Google Calendar'

  if (!calendarModalOpen) return null

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-200 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={step !== 'auth' && step !== 'success' ? handleClose : undefined}
      />

      {/* Modal */}
      <div
        className={`relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden transition-all duration-300 ${
          isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100 wizard-modal-enter'
        }`}
      >
        {/* Header accent bar */}
        <div className="h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

        {/* Close button */}
        {step !== 'auth' && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Step indicator */}
        {step !== 'success' && (
          <div className="flex items-center justify-center gap-2 pt-5 pb-2">
            {steps.slice(0, -1).map((s, i) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i <= stepIndex
                    ? 'w-8 bg-primary'
                    : 'w-4 bg-muted'
                }`}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Welcome Step - Provider Selection */}
          {step === 'welcome' && (
            <div className="wizard-step-enter">
              <div className="text-center pt-3 mb-4">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Koppla din kalender
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  Välj vilken kalender du vill synka med Workly. Samtal, bokningar och påminnelser hamnar direkt i din kalender.
                </p>
              </div>

              {/* Illustration moved here from features step */}
              <WelcomeIllustration provider={selectedProvider} />

              <div className="space-y-3 mb-6">
                <ProviderCard
                  provider="microsoft"
                  selected={selectedProvider === 'microsoft'}
                  onClick={() => setSelectedProvider('microsoft')}
                />
                <ProviderCard
                  provider="google"
                  selected={selectedProvider === 'google'}
                  onClick={() => setSelectedProvider('google')}
                  comingSoon
                />
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                  </div>
                  Bokade samtal visas i din kalender
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  Ändringar i Workly synkas automatiskt
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                  </div>
                  Säker OAuth 2.0-anslutning
                </div>
              </div>

              {/* CTA */}
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  Kom igång
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Features Step (only shown when showAllFeatures is true) */}
          {step === 'features' && (
            <div className="wizard-step-enter">
              <div className="text-center pt-3 mb-6">
                <h2 className="text-lg font-bold text-foreground mb-1">
                  Välj funktioner
                </h2>
                <p className="text-sm text-muted-foreground">
                  Välj vad du vill synka till {calendarName}. Du kan ändra detta i inställningarna senare.
                </p>
              </div>

              <div className="space-y-3">
                <FeatureCard
                  icon={<Calendar className="w-5 h-5" />}
                  title={`Samtal i ${calendarName}`}
                  description={`Bokade samtal visas automatiskt som kalenderhändelser i ${calendarName}. Deltagare får en inbjudan.`}
                  checked={features.samtal}
                  onChange={(checked) => setFeatures({ ...features, samtal: checked })}
                  recommended
                />

                <FeatureCard
                  icon={<Cake className="w-5 h-5" />}
                  title="Födelsedagar"
                  description={`Medarbetarnas födelsedagar visas i en delad kalender i ${calendarName}.`}
                  checked={features.birthdays}
                  onChange={(checked) => setFeatures({ ...features, birthdays: checked })}
                />

                <FeatureCard
                  icon={<BarChart3 className="w-5 h-5" />}
                  title="Undersökningspåminnelser"
                  description={`Påminnelser för pulsundersökningar läggs in i ${calendarName}.`}
                  checked={features.surveys}
                  onChange={(checked) => setFeatures({ ...features, surveys: checked })}
                />

                <FeatureCard
                  icon={<ListChecks className="w-5 h-5" />}
                  title="Arbetsflöden"
                  description={`Deadlines för onboarding- och offboarding-uppgifter synkas till ${calendarName}.`}
                  checked={features.workflows}
                  onChange={(checked) => setFeatures({ ...features, workflows: checked })}
                />
              </div>

              {/* Navigation */}
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Tillbaka
                </button>
                <button
                  onClick={handleNext}
                  disabled={!atLeastOneFeatureEnabled}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                >
                  {isMs ? <MicrosoftLogo className="w-4 h-4" /> : <GoogleLogo className="w-4 h-4" />}
                  Anslut med {providerName}
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Auth Step */}
          {step === 'auth' && (
            <div className="wizard-step-enter py-4">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-foreground mb-1">
                  Logga in med {providerName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ett inloggningsfönster har öppnats. Godkänn åtkomsten för att fortsätta.
                </p>
              </div>

              <AuthSimulation
                provider={selectedProvider}
                onComplete={handleAuthComplete}
                onCancel={() => {
                  // Go back to the previous step in the steps array
                  const authIndex = steps.indexOf('auth')
                  if (authIndex > 0) {
                    setStep(steps[authIndex - 1])
                  }
                }}
              />
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="py-6">
              <SuccessView features={features} provider={selectedProvider} />

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleFinish}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  Klar!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
