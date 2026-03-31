import { useState, useEffect } from 'react'
import { useStore } from './store/useStore'
import {
  MainNavigation,
  MainNavigationHeader,
  MainNavigationContent,
  MainNavigationItem,
  MainNavigationFooter,
  WorklyLogo,
  Page,
  PageHeader,
  PageTitle,
  PageHeading,
  PageDescription,
  PageActions,
  PageContent,
  PageFilters,
  Button,
} from '@c.olander/proto-ui'
import {
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  Sun,
  Moon,
  PanelLeft,
  PanelLeftClose,
  Check,
} from 'lucide-react'
import ConversationList from './components/ConversationList'
import SamtalHeader from './components/Header/SamtalHeader'
import TabNavigation from './components/Header/TabNavigation'
import AnteckningarTab from './components/Anteckningar/AnteckningarTab'
import UppgifterMalTab from './components/UppgifterMal/UppgifterMalTab'
import RightPanel from './components/RightPanel/RightPanel'
import CommentsSection from './components/Comments/CommentsSection'
import TaskModal from './components/modals/TaskModal'
import CalendarConnectModal from './components/modals/CalendarConnectModal'
import CalendarSettingsPage from './components/CalendarSettingsPage'
// import ProductTour from './components/ProductTour/ProductTour'
import { mockConversationList } from './lib/mockData'

// Microsoft logo for sidebar
function MicrosoftLogoSmall() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 21 21" fill="none">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  )
}

// Google logo for sidebar
function GoogleLogoSmall() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

// Helper to get conversation ID from URL
function getConversationIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search)
  return params.get('id')
}

// Helper to update URL with conversation ID
function updateUrlWithConversationId(id: string | null) {
  const url = new URL(window.location.href)
  if (id) {
    url.searchParams.set('id', id)
  } else {
    url.searchParams.delete('id')
  }
  window.history.pushState({}, '', url.toString())
}

function App() {
  const { activeTab, rightPanelCollapsed, loadSamtal, currentPage, setCurrentPage, calendarIntegration, openCalendarModal } = useStore()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then browser preference
    const stored = localStorage.getItem('workly-theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(() => {
    // Initialize from URL on first render
    return getConversationIdFromUrl()
  })

  // Load samtal from URL on initial mount
  useEffect(() => {
    const idFromUrl = getConversationIdFromUrl()
    if (idFromUrl) {
      // Verify the ID exists in mock data
      const exists = mockConversationList.some(c => c.id === idFromUrl)
      if (exists) {
        loadSamtal(idFromUrl)
        setSelectedConversationId(idFromUrl)
      } else {
        // Invalid ID, clear from URL
        updateUrlWithConversationId(null)
        setSelectedConversationId(null)
      }
    }
  }, [])

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const idFromUrl = getConversationIdFromUrl()
      if (idFromUrl) {
        const exists = mockConversationList.some(c => c.id === idFromUrl)
        if (exists) {
          loadSamtal(idFromUrl)
          setSelectedConversationId(idFromUrl)
        } else {
          setSelectedConversationId(null)
        }
      } else {
        setSelectedConversationId(null)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [loadSamtal])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const next = !isDarkMode
    const html = document.documentElement
    html.classList.toggle('dark', next)
    html.classList.toggle('light', !next)
    html.style.colorScheme = next ? 'dark' : 'light'
    localStorage.setItem('workly-theme', next ? 'dark' : 'light')
    setIsDarkMode(next)
  }

  // Apply initial theme class on mount
  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle('dark', isDarkMode)
    html.classList.toggle('light', !isDarkMode)
    html.style.colorScheme = isDarkMode ? 'dark' : 'light'
  }, [])

  const currentUser = {
    name: 'Erik Axelsson',
    email: 'erik.axelsson@workly.se',
    initials: 'EA',
  }

  // Handle conversation selection
  const handleSelectConversation = (id: string) => {
    loadSamtal(id)
    setSelectedConversationId(id)
    setCurrentPage('samtal')
    updateUrlWithConversationId(id)
  }

  // Handle going back to list
  const handleBackToList = () => {
    setSelectedConversationId(null)
    updateUrlWithConversationId(null)
  }

  // Get selected conversation details
  const selectedConversation = selectedConversationId
    ? mockConversationList.find((c) => c.id === selectedConversationId)
    : null

  // Show list view or detail view
  const showingListView = !selectedConversationId

  // Tour disabled - kept in codebase for future use
  // useEffect(() => {
  //   if (showingListView && !tourCompleted.list) {
  //     const timeout = setTimeout(() => startTour('list'), 600)
  //     return () => clearTimeout(timeout)
  //   }
  // }, [])
  // useEffect(() => {
  //   if (!showingListView && !tourCompleted.detail) {
  //     const timeout = setTimeout(() => startTour('detail'), 800)
  //     return () => clearTimeout(timeout)
  //   }
  // }, [showingListView])

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Navigation */}
      <MainNavigation collapsed={sidebarCollapsed}>
        <MainNavigationHeader>
          {!sidebarCollapsed ? (
            <>
              <WorklyLogo size="sm" showWordmark={true} />
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <WorklyLogo size="sm" showWordmark={false} />
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                <PanelLeft className="w-5 h-5" />
              </button>
            </>
          )}
        </MainNavigationHeader>

        <MainNavigationContent>
          <MainNavigationItem icon={<Home className="w-full h-full" />}>
            Hem
          </MainNavigationItem>
          <MainNavigationItem icon={<Users className="w-full h-full" />}>
            Medarbetare
          </MainNavigationItem>
          <div data-tour="sidebar-samtal">
            <MainNavigationItem
              active={currentPage === 'samtal'}
              icon={<Calendar className="w-full h-full" />}
              onClick={() => { setCurrentPage('samtal'); setSelectedConversationId(null); updateUrlWithConversationId(null) }}
            >
              Samtal
            </MainNavigationItem>
          </div>
          <MainNavigationItem icon={<FileText className="w-full h-full" />}>
            Dokument
          </MainNavigationItem>

          {/* Divider */}
          <div className="h-px bg-black/10 dark:bg-white/10 my-2" />

          <MainNavigationItem
            active={currentPage === 'settings'}
            icon={<Settings className="w-full h-full" />}
            onClick={() => { setCurrentPage('settings'); setSelectedConversationId(null); updateUrlWithConversationId(null) }}
          >
            Inställningar
          </MainNavigationItem>
        </MainNavigationContent>

        <MainNavigationFooter>
          {/* Calendar Integration Button */}
          <button
            onClick={() => {
              if (calendarIntegration.connected) {
                setCurrentPage('settings')
                setSelectedConversationId(null)
                updateUrlWithConversationId(null)
              } else {
                openCalendarModal()
              }
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors mb-1 ${
              sidebarCollapsed ? 'justify-center' : ''
            } ${
              calendarIntegration.connected
                ? 'text-primary hover:bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
            title={calendarIntegration.connected
              ? `${calendarIntegration.provider === 'microsoft' ? 'Microsoft 365' : 'Google Calendar'} ansluten`
              : 'Kalendersynk'
            }
          >
            {calendarIntegration.connected && calendarIntegration.provider === 'microsoft' ? (
              <MicrosoftLogoSmall />
            ) : calendarIntegration.connected && calendarIntegration.provider === 'google' ? (
              <GoogleLogoSmall />
            ) : (
              <Calendar className="w-4 h-4" />
            )}
            {!sidebarCollapsed && (
              <span className="text-xs flex items-center gap-1.5">
                {calendarIntegration.connected
                  ? calendarIntegration.provider === 'microsoft'
                    ? 'Microsoft 365'
                    : 'Google Calendar'
                  : 'Kalendersynk'
                }
                {calendarIntegration.connected && (
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary">
                    <Check className="w-2.5 h-2.5 text-primary-foreground" />
                  </span>
                )}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors mb-2 ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4" />
                {!sidebarCollapsed && <span className="text-xs">Light Mode</span>}
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                {!sidebarCollapsed && <span className="text-xs">Dark Mode</span>}
              </>
            )}
          </button>

          {/* User Info */}
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 px-2 py-2 mt-1">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                {currentUser.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentUser.email}
                </p>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                {currentUser.initials}
              </div>
            </div>
          )}
        </MainNavigationFooter>
      </MainNavigation>

      {/* Main Content Area */}
      <Page className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {currentPage === 'settings' ? (
          <div key="settings-view" className="view-enter flex-1 overflow-y-auto">
            <PageHeader>
              <PageTitle>
                <PageHeading>Inställningar</PageHeading>
                <PageDescription>Hantera integrationer och kontoinställningar</PageDescription>
              </PageTitle>
            </PageHeader>
            <PageContent>
              <CalendarSettingsPage />
            </PageContent>
          </div>
        ) : showingListView ? (
          <div key="list-view" className="view-enter">
            {/* List View */}
            <PageHeader>
              <PageTitle>
                <div data-tour="list-heading">
                  <PageHeading>Mina samtal</PageHeading>
                  <PageDescription>Hantera dina medarbetarsamtal</PageDescription>
                </div>
                <PageActions>
                  <Button data-tour="list-new-button">+ Nytt samtal</Button>
                </PageActions>
              </PageTitle>
            </PageHeader>

            <PageContent>
              <ConversationList onSelectConversation={handleSelectConversation} />
            </PageContent>
          </div>
        ) : (
          <div key="detail-view" className="view-enter flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Detail View with Breadcrumbs */}
            <PageHeader
              breadcrumbs={
                <span className="flex items-center gap-2">
                  <button
                    onClick={handleBackToList}
                    className="text-foreground hover:text-primary transition-colors"
                    data-tour="breadcrumb-back"
                  >
                    Samtal
                  </button>
                  <span>/</span>
                  <span className="text-muted-foreground/60">{selectedConversation?.name}</span>
                </span>
              }
            >
              <SamtalHeader onBack={handleBackToList} />
            </PageHeader>

            <PageFilters>
              <TabNavigation />
            </PageFilters>

            <PageContent className="!overflow-hidden !p-0 !h-full">
              <div
                className={`h-full ${
                  activeTab === 'anteckningar'
                    ? rightPanelCollapsed
                      ? 'grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6'
                      : 'grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6'
                    : ''
                } px-6 py-6`}
              >
                {/* Center Column - Tab Content with independent scroll */}
                <div className="overflow-y-auto min-h-0 h-full">
                  <div className="space-y-6 transition-all duration-300 pb-6 pr-2">
                    {/* Keep AnteckningarTab always mounted so editor stays available for task chip insertion */}
                    <div className={activeTab === 'anteckningar' ? '' : 'hidden'}>
                      <AnteckningarTab />
                    </div>
                    <div className={activeTab === 'uppgifter-mål' ? '' : 'hidden'}>
                      <UppgifterMalTab />
                    </div>

                    {/* Comments Section - Only show on Anteckningar tab */}
                    {activeTab === 'anteckningar' && <CommentsSection />}
                  </div>
                </div>

                {/* Right Panel - Independent scroll, only as tall as content */}
                {activeTab === 'anteckningar' && (
                  <div className="overflow-y-auto min-h-0 max-h-full">
                    <RightPanel />
                  </div>
                )}
              </div>
            </PageContent>
          </div>
        )}
      </Page>

      {/* Task/Goal Modal */}
      <TaskModal />

      {/* Calendar Connect Modal */}
      <CalendarConnectModal />

      {/* Product Tour - disabled for now */}
      {/* <ProductTour /> */}
    </div>
  )
}

export default App
