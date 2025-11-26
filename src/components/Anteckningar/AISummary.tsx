import { useStore } from '../../store/useStore'
import { AISummary as AISummaryType } from '../../types'
import { 
  ClipboardList, 
  MessageSquare, 
  Target, 
  BarChart3, 
  Rocket, 
  PenTool 
} from 'lucide-react'

interface AISummaryProps {
  summaryData?: AISummaryType
}

export default function AISummary({ summaryData }: AISummaryProps) {
  const { tasks, currentSamtal, rightPanelCollapsed } = useStore()

  // Use provided data or fallback to hardcoded/store data (for active view prototype)
  const data = summaryData || {
    overview: 'Ett konstruktivt medarbetarsamtal med Lisa Eriksson där vi diskuterade hennes prestationer under 2025 och framtida utvecklingsmål. Lisa har visat stark försäljningsförmåga och god kundrelationshantering. Samtalet fokuserade främst på löneöversyn och hennes mål för Q1 2026.',
    keyDiscussions: [
      'Prestationsöversikt: Lisa överträffade sina försäljningsmål med 15% under året och fick utmärkt feedback från kunder i norra regionen.',
      'Marknadsanalys: Diskuterade branschstandard för lönenivåer och Lisas position i förhållande till marknaden och interna kollegor.',
      'Utvecklingsområden: Lisa uttryckte intresse för att utveckla sina ledarskapsfärdigheter och eventuellt ta på sig mer mentorskapsansvar.'
    ],
    managerNotes: [
      'Lisa är redo för mer ansvar - överväg teamledarpositionen som öppnas i Q2',
      'Stark kandidat för CRM-ambassadör i organisationen',
      'Behöver stöd med tidplanering - många parallella projekt'
    ],
    goalsAndTasks: {
      goals: tasks.filter(t => t.origin?.conversationId === currentSamtal.id && t.type === 'goal').map(g => ({ title: g.title, due: g.due, status: g.status })),
      tasks: tasks.filter(t => t.origin?.conversationId === currentSamtal.id && t.type === 'task').map(t => ({ title: t.title, due: t.due, status: t.status }))
    },
    surveyInsights: [
      'Högt betyg på arbetstillfredsställelse (4.5/5) och teamsamarbete (4.8/5)',
      'Något lägre betyg på work-life balance (3.5/5) - diskutera arbetsbörda'
    ],
    nextSteps: [
      'Bekräfta lönejustering med HR senast 30 november',
      'Boka CRM-utbildning för januari 2026',
      'Uppföljningsmöte i mars för att utvärdera progress mot Q1-mål'
    ]
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className={`px-8 py-8 ${rightPanelCollapsed ? 'max-w-5xl' : 'max-w-4xl mx-auto'}`}>
        <div className="space-y-8">
          
          {/* Overview */}
          <section>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
              <ClipboardList className="w-5 h-5 text-muted-foreground" />
              Översikt
            </h2>
            <p className="text-foreground/90 leading-relaxed">
              {data.overview}
            </p>
          </section>

          {/* Key Discussions */}
          <section>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              Viktiga diskussioner
            </h2>
            <div className="space-y-3">
              {data.keyDiscussions.map((item, i) => (
                <div key={i} className="bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500 p-4 rounded-r-lg text-foreground/90">
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Manager Notes */}
          <section>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
              <PenTool className="w-5 h-5 text-muted-foreground" />
              Chefens anteckningar
            </h2>
            <ul className="space-y-2">
              {data.managerNotes.map((note, i) => (
                <li key={i} className="text-foreground/90 pl-1">
                  {note}
                </li>
              ))}
            </ul>
          </section>

          {/* Goals & Tasks */}
          {(data.goalsAndTasks.goals.length > 0 || data.goalsAndTasks.tasks.length > 0) && (
            <section>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-muted-foreground" />
                Mål och uppgifter
              </h2>
              <div className="space-y-3">
                {data.goalsAndTasks.goals.map((goal, i) => (
                  <div key={`goal-${i}`} className="flex items-center gap-3 text-foreground/90">
                    <Target className="w-4 h-4 text-red-500" />
                    <span className="font-medium">{goal.title}</span>
                    {goal.status && <span className="text-xs text-muted-foreground">({goal.status})</span>}
                  </div>
                ))}
                {data.goalsAndTasks.tasks.map((task, i) => (
                  <div key={`task-${i}`} className="flex items-center gap-3 text-foreground/90">
                    <ClipboardList className="w-4 h-4 text-blue-500" />
                    <span>{task.title}</span>
                    {task.status && <span className="text-xs text-muted-foreground">({task.status})</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Survey Insights */}
          {data.surveyInsights.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
                Enkätinsikter
              </h2>
              <ul className="space-y-2">
                {data.surveyInsights.map((insight, i) => (
                  <li key={i} className="text-foreground/90 pl-1">
                    {insight}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Next Steps */}
          {data.nextSteps.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
                <Rocket className="w-5 h-5 text-muted-foreground" />
                Nästa steg
              </h2>
              <ul className="space-y-2">
                {data.nextSteps.map((step, i) => (
                  <li key={i} className="text-foreground/90 pl-1">
                    {step}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <hr className="border-border my-8" />

          <p className="text-xs text-muted-foreground italic">
            AI kan göra misstag. Kontrollera alltid innehållet.
          </p>
        </div>
      </div>
    </div>
  )
}
