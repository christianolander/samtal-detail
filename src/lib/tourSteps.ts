/**
 * Product Tour Step Definitions
 *
 * Two tour phases:
 * 1. "list" - Overview of Mina samtal list view
 * 2. "detail" - Inside a samtal detail view
 *
 * Copy is written in Swedish, warm and friendly tone.
 */

export interface TourStep {
  /** CSS selector for the target element */
  target: string
  /** Short, catchy Swedish title */
  title: string
  /** 1-2 sentences of helpful copy */
  content: string
  /** Tooltip placement relative to target */
  placement: 'top' | 'bottom' | 'left' | 'right'
  /** Extra padding around spotlight (px) */
  spotlightPadding?: number
  /** Action to run before this step renders (e.g., switch tabs) */
  beforeStep?: () => void
}

// ============================================================
// Phase 1: Mina samtal list view
// ============================================================
export const listTourSteps: TourStep[] = [
  {
    target: '[data-tour="list-heading"]',
    title: 'Valkomna till Samtal!',
    content:
      'Det har ar din samtalsoversikt. Alla medarbetarsamtal samlade pa ett och samma stalle, med status, deltagare och deadlines.',
    placement: 'bottom',
    spotlightPadding: 12,
  },
  {
    target: '[data-tour="list-table"]',
    title: 'Dina samtal i oversikt',
    content:
      'Varje rad ar ett samtal. Hovra over deltagarna for att se vem som ar med. Samtalen sorteras sa att det viktigaste hamnar overst.',
    placement: 'top',
    spotlightPadding: 4,
  },
  {
    target: '[data-tour="list-new-button"]',
    title: 'Skapa ett nytt samtal',
    content:
      'Nar det ar dags att boka in ett nytt medarbetarsamtal borjar du har. Det tar bara en minut att komma igang!',
    placement: 'bottom',
    spotlightPadding: 8,
  },
  {
    target: '[data-tour="sidebar-samtal"]',
    title: 'Alltid nara till hands',
    content:
      'Du hittar alltid tillbaka hit via menyn. Har kan du aven navigera till medarbetare, dokument och installningar.',
    placement: 'right',
    spotlightPadding: 6,
  },
]

// ============================================================
// Phase 2: Inside a samtal detail view
// ============================================================
export const detailTourSteps: TourStep[] = [
  {
    target: '[data-tour="detail-header"]',
    title: 'Har bor ditt samtal',
    content:
      'Overst ser du samtalets namn, status och vilka som deltar. Statusen uppdateras automatiskt nar du bokar och genomfor samtalet.',
    placement: 'bottom',
    spotlightPadding: 8,
  },
  {
    target: '[data-tour="detail-tabs"]',
    title: 'Tva flikar, tva superkrafter',
    content:
      'Under "Anteckningar" skriver du agenda och mottesanteckningar. Under "Uppgifter & mal" haller ni koll pa allt ni bestammer tillsammans.',
    placement: 'bottom',
    spotlightPadding: 6,
  },
  {
    target: '[data-tour="detail-editor"]',
    title: 'Din anteckningsyta',
    content:
      'Har forbereder du agendan och antecknar under motets gang. Du kan skapa mal och uppgifter direkt i texten. Allt sparas automatiskt!',
    placement: 'right',
    spotlightPadding: 4,
  },
  {
    target: '[data-tour="detail-right-panel"]',
    title: 'Allt du behover, bredvid dig',
    content:
      'Verktyg, detaljer, timer, tidigare samtal och privata anteckningar. Tabba runt for att hitta det du behover, eller fall ihop panelen for mer plats.',
    placement: 'left',
    spotlightPadding: 8,
  },
  {
    target: '[data-tour="detail-comments"]',
    title: 'Kommentarer for samarbete',
    content:
      'Diskutera med kollegor infor eller efter samtalet. Perfekt for forberedelsetips eller reflektioner efterat!',
    placement: 'top',
    spotlightPadding: 4,
  },
  {
    target: '[data-tour="breadcrumb-back"]',
    title: 'Enkelt att navigera tillbaka',
    content:
      'Klicka har for att komma tillbaka till oversikten. Nu ar du redo att kora iggang - lycka till med ditt forsta samtal!',
    placement: 'bottom',
    spotlightPadding: 6,
  },
]
