import { useState } from 'react'
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
} from 'lucide-react'
import ConversationList from './components/ConversationList'
import SamtalHeader from './components/Header/SamtalHeader'
import TabNavigation from './components/Header/TabNavigation'
import AnteckningarTab from './components/Anteckningar/AnteckningarTab'
import UppgifterMalTab from './components/UppgifterMal/UppgifterMalTab'
import RightPanel from './components/RightPanel/RightPanel'
import CommentsSection from './components/Comments/CommentsSection'
import TaskModal from './components/modals/TaskModal'
import { mockConversationList } from './lib/mockData'

function App() {
  const { activeTab, rightPanelCollapsed, loadSamtal } = useStore()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  // Toggle dark mode
  const toggleDarkMode = () => {
    const html = document.documentElement
    if (!isDarkMode) {
      html.classList.add('dark')
      html.classList.remove('light')
    } else {
      html.classList.remove('dark')
      html.classList.add('light')
    }
    setIsDarkMode(!isDarkMode)
  }

  const currentUser = {
    name: 'Erik Axelsson',
    email: 'erik.axelsson@workly.se',
    initials: 'EA',
  }

  // Handle conversation selection
  const handleSelectConversation = (id: string) => {
    loadSamtal(id)
    setSelectedConversationId(id)
  }

  // Get selected conversation details
  const selectedConversation = selectedConversationId
    ? mockConversationList.find((c) => c.id === selectedConversationId)
    : null

  // Show list view or detail view
  const showingListView = !selectedConversationId

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
          <MainNavigationItem active={true} icon={<Calendar className="w-full h-full" />}>
            Samtal
          </MainNavigationItem>
          <MainNavigationItem icon={<FileText className="w-full h-full" />}>
            Dokument
          </MainNavigationItem>

          {/* Divider */}
          <div className="h-px bg-black/10 dark:bg-white/10 my-2" />

          <MainNavigationItem icon={<Settings className="w-full h-full" />}>
            Inställningar
          </MainNavigationItem>
        </MainNavigationContent>

        <MainNavigationFooter>
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
        {showingListView ? (
          <div key="list-view" className="view-enter">
            {/* List View */}
            <PageHeader>
              <PageTitle>
                <div>
                  <PageHeading>Mina samtal</PageHeading>
                  <PageDescription>Hantera dina medarbetarsamtal</PageDescription>
                </div>
                <PageActions>
                  <Button>+ Nytt samtal</Button>
                </PageActions>
              </PageTitle>
            </PageHeader>

            <PageContent>
              <ConversationList onSelectConversation={handleSelectConversation} />
            </PageContent>
          </div>
        ) : (
          <div key="detail-view" className="view-enter flex-1 flex flex-col min-h-0">
            {/* Detail View with Breadcrumbs */}
            <PageHeader
              breadcrumbs={
                <span className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedConversationId(null)}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Samtal
                  </button>
                  <span>/</span>
                  <span className="text-muted-foreground/60">{selectedConversation?.name}</span>
                </span>
              }
            >
              <SamtalHeader onBack={() => setSelectedConversationId(null)} />
            </PageHeader>

            <PageFilters>
              <TabNavigation />
            </PageFilters>

            <PageContent>
              <div
                className={`${
                  activeTab === 'anteckningar'
                    ? rightPanelCollapsed
                      ? 'grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6'
                      : 'grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6'
                    : ''
                }`}
              >
                {/* Center Column - Tab Content */}
                <div className="space-y-6 transition-all duration-300">
                  {activeTab === 'anteckningar' ? (
                    <AnteckningarTab />
                  ) : (
                    <UppgifterMalTab />
                  )}

                  {/* Comments Section - Only show on Anteckningar tab */}
                  {activeTab === 'anteckningar' && <CommentsSection />}
                </div>

                {/* Right Panel - Always show on Anteckningar tab, sticky at top */}
                {activeTab === 'anteckningar' && (
                  <div className="lg:sticky lg:top-6 lg:self-start">
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
    </div>
  )
}

export default App
