import { useStore } from '@/store/useStore'

export default function TabNavigation() {
  const { activeTab, setActiveTab } = useStore()

  return (
    <div className="border-b border-border">
      <nav className="flex gap-6" role="tablist">
        <button
          onClick={() => setActiveTab('anteckningar')}
          className={`pb-3 px-1 border-b-2 font-medium transition-all duration-200 ${
            activeTab === 'anteckningar'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          }`}
          role="tab"
          aria-selected={activeTab === 'anteckningar'}
          aria-controls="anteckningar-panel"
        >
          Anteckningar
        </button>
        <button
          onClick={() => setActiveTab('uppgifter-mål')}
          className={`pb-3 px-1 border-b-2 font-medium transition-all duration-200 ${
            activeTab === 'uppgifter-mål'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          }`}
          role="tab"
          aria-selected={activeTab === 'uppgifter-mål'}
          aria-controls="uppgifter-mal-panel"
        >
          Uppgifter & mål
        </button>
      </nav>
    </div>
  )
}
