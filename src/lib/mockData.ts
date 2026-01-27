/**
 * Mock Data for Samtal Detail View
 *
 * This file contains all the mock data for demonstrating the prototype.
 * Based on reference data from earlier prototype + PRD requirements.
 */

import type {
  Samtal,
  Participant,
  User,
  Task,
  HistoricalMeeting,
  SurveyData,
  HistoricalSurveyData,
  PrivateNote,
} from '../types'

// ========================================
// Conversation List Data
// ========================================

export interface ConversationListItem {
  id: string
  name: string
  participants: Participant[]
  type: 'Lönerevision' | 'Medarbetarsamtal' | 'Lönesamtal'
  role: 'Deltagare' | 'CEO' | 'Manager'
  status: 'Ej bokad' | 'Genomförd' | 'Bokad' | 'Planerad'
  bookedTime?: string
  deadline: string
  icon: string
  conversationRoundName?: string
}

// ========================================
// Participants
// ========================================

export const erikAxelsson: Participant = {
  id: '1',
  name: 'Erik Axelsson',
  email: 'erik.axelsson@workly.se',
  title: 'Engineering Manager',
  roleInSamtal: 'Ansvarig',
  avatar: 'https://i.pravatar.cc/150?u=erik',
}

export const lisaEriksson: Participant = {
  id: '2',
  name: 'Lisa Svensson',
  email: 'lisa.svensson@workly.se',
  title: 'Sales Representative',
  roleInSamtal: 'Deltagare',
  avatar: 'https://i.pravatar.cc/150?u=lisa',
}

export const annaAndersson: Participant = {
  id: '3',
  name: 'Anna Andersson',
  email: 'anna.andersson@workly.se',
  title: 'HR Manager',
  roleInSamtal: 'Deltagare',
  avatar: 'https://i.pravatar.cc/150?u=anna',
}

export const sarahAhmed: Participant = {
  id: '6',
  name: 'Sarah Ahmed',
  title: 'UX Designer',
  roleInSamtal: 'Deltagare',
  avatar: 'https://i.pravatar.cc/150?u=sarah',
}

export const davidPersson: Participant = {
  id: '7',
  name: 'David Persson',
  title: 'Backend Developer',
  roleInSamtal: 'Deltagare',
  avatar: 'https://i.pravatar.cc/150?u=david',
}

export const emmaKarlsson: Participant = {
  id: '8',
  name: 'Emma Karlsson',
  title: 'Frontend Developer',
  roleInSamtal: 'Deltagare',
  avatar: 'https://i.pravatar.cc/150?u=emma',
}

export const marcusLindqvist: Participant = {
  id: '9',
  name: 'Marcus Lindqvist',
  title: 'QA Engineer',
  roleInSamtal: 'Deltagare',
  avatar: 'https://i.pravatar.cc/150?u=marcus',
}

export const johanNilsson: Participant = {
  id: '10',
  name: 'Johan Nilsson',
  title: 'DevOps Engineer',
  roleInSamtal: 'Deltagare',
  avatar: 'https://i.pravatar.cc/150?u=johan',
}

export const mariaNilsson: Participant = {
  id: '5',
  name: 'Maria Nilsson',
  title: 'Product Owner',
  roleInSamtal: 'Ansvarig',
  avatar: 'https://i.pravatar.cc/150?u=maria',
}

export const karinLarsson: Participant = {
  id: '11',
  name: 'Karin Larsson',
  title: 'Project Manager',
  roleInSamtal: 'Deltagare',
  avatar: 'https://i.pravatar.cc/150?u=karin',
}

export const erikDanielsson: Participant = {
  id: '12',
  name: 'Erik Danielsson',
  email: 'erik.danielsson@workly.se',
  title: 'Marketing Specialist',
  roleInSamtal: 'Deltagare',
  avatar: 'https://i.pravatar.cc/150?u=erikd',
}

// ========================================
// Agendas
// ========================================

export const salaryReviewAgenda = `<h1>💰 Lönesamtal</h1>

<h2>📊 Prestationsöversikt</h2>
<ul>
  <li>Genomgång av årets resultat och bidrag</li>
  <li>Uppnådda mål och leveranser</li>
  <li>Feedback från kollegor och kunder</li>
</ul>

<h2>💼 Marknadsanalys</h2>
<ul>
  <li>Branschstandard och lönenivåer</li>
  <li>Intern lönespridning och rättvisa</li>
  <li>Utveckling av rollen</li>
</ul>

<h2>🎯 Framtida förväntningar</h2>
<ul>
  <li>Mål och ansvar för kommande period</li>
  <li>Utvecklingsområden och kompetensbehov</li>
  <li>Karriärväg och progression</li>
</ul>

<h2>💰 Löneöversyn</h2>
<ul>
  <li>Diskussion om lönejustering</li>
  <li>Andra förmåner och benefits</li>
  <li>Implementering och tidplan</li>
</ul>

<h2>📝 Anteckningar</h2>
<p><em>Gör anteckningar här under samtalet...</em></p>
`

// Marcus Lindqvist completed notes (performed but not marked done)
const marcusCompletedNotes = `
<div class="space-y-8">
  <div>
    <h1 class="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
      <span class="text-3xl">💰</span> Lönerevision 2025
    </h1>
    <div class="space-y-6">
      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3 flex items-center gap-2"><span>📊</span> Prestationsöversikt</h2>
        <div class="pl-0 space-y-2 text-foreground/80">
          <p><strong>Sammanfattning av året:</strong></p>
          <p>Marcus har haft ett exceptionellt år som QA Engineer. Hans insatser med automatiserad testning har revolutionerat vårt kvalitetsarbete. Testtäckningen har ökat från 45% till 78%, och antalet produktionsbuggar har minskat med 60%.</p>
          <p><strong>Nyckel-leveranser:</strong></p>
          <ul>
            <li>Implementerat Cypress för E2E-testning</li>
            <li>Byggt CI/CD pipeline med automatiska tester</li>
            <li>Mentorat för 2 juniora QA-kollegor</li>
            <li>Dokumenterat alla testprocesser</li>
          </ul>
        </div>
      </section>
      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3 flex items-center gap-2"><span>💼</span> Marknadsanalys</h2>
        <div class="pl-0 space-y-2 text-foreground/80">
          <p><strong>Lönejämförelse:</strong></p>
          <p>Marcus ligger idag på 48 000 kr/mån. Marknadsmässigt för en Senior QA Engineer med hans erfarenhet (5 år) och specialkompetens inom test-automation ligger snittet på 52-56 000 kr/mån i Stockholmsområdet.</p>
          <p><strong>Intern jämförelse:</strong></p>
          <p>Hans bidrag till teamet och organisationen motiverar en justering mot övre kvartilen.</p>
        </div>
      </section>
      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3 flex items-center gap-2"><span>🎯</span> Framtida förväntningar</h2>
        <div class="pl-0 space-y-2 text-foreground/80">
          <p><strong>Mål för 2026:</strong></p>
          <p>Vi diskuterade Marcus nästa steg i karriären. Han är intresserad av att ta ett mer ledande ansvar för QA-strategin.</p>
          <p><span data-task-chip="" data-task-id="goal-marcus-2025-1" data-title="Leda QA-strategiarbetet" data-type="goal"></span></p>
          <p><span data-task-chip="" data-task-id="goal-marcus-2025-2" data-title="Uppnå 85% testtäckning" data-type="goal"></span></p>
          <p><strong>Uppgifter:</strong></p>
          <p><span data-task-chip="" data-task-id="task-marcus-2025-1" data-title="Skapa QA roadmap för Q1" data-type="task"></span></p>
        </div>
      </section>
      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3 flex items-center gap-2"><span>💰</span> Löneöversyn</h2>
        <div class="pl-0 space-y-2 text-foreground/80">
          <p><strong>Beslut:</strong></p>
          <p>Efter diskussion har vi kommit överens om en lönejustering på <strong>6.5%</strong>, vilket tar Marcus från 48 000 kr till 51 120 kr/mån. Detta träder i kraft från 1 januari 2026.</p>
          <p><strong>Bonus:</strong></p>
          <p>Marcus kvalificerar sig även för en engångsbonus på 15 000 kr för sitt extraordinära arbete med test-automationen.</p>
          <p><strong>Marcus reaktion:</strong></p>
          <p>Marcus är nöjd med utfallet och känner sig uppskattad. Han ser fram emot att ta mer ansvar framöver.</p>
        </div>
      </section>
      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3 flex items-center gap-2"><span>📝</span> Chefens anteckningar</h2>
        <div class="pl-0 space-y-2 text-foreground/80 bg-muted/30 p-4 rounded-lg border-l-4 border-primary">
          <p><em>Privata reflektioner (ej delade med Marcus):</em></p>
          <ul>
            <li>Marcus är en nyckelperson - vi måste se till att han känner sig värdesatt</li>
            <li>Överväg befordran till Senior QA Lead inom 6-12 månader</li>
            <li>Risk att han blir attraktiv för konkurrenter - behålla med utvecklingsmöjligheter</li>
            <li>Följ upp bonusfrågan - är det möjligt med kvartalsvis bonus för nyckeltal?</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</div>`

// Medarbetarsamtal Template 2026
const medarbetarsamtalTemplate = `
<div class="space-y-8">
  <div>
    <h1 class="text-3xl font-bold text-foreground mb-4">👋 Välkommen</h1>
    <p class="text-foreground/80 mb-8">Medarbetarsamtalet är ett planerat och strukturerat samtal med syfte att skapa dialog kring arbetssituation, prestation och utveckling. Samtalet ger oss möjlighet att stanna upp, reflektera och gemensamt blicka framåt. Under samtalet har vi en öppen dialog och ett gemensamt ansvar.</p>

    <p><br></p>

    <div class="space-y-8">
      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">🔄 Inledning, tillbakablick och nuläge</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p><strong>1. Hur upplever du din arbetssituation just nu? Vad tar och ger dig energi?</strong></p>
          <p><br></p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">📋 Arbetsuppgifter och ansvar</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Säkerställa tydlighet, rimlig arbetsbelastning, fokus och förutsättningar.</p>
          <p><strong>2. Vad är viktigt i jobbet för att du ska må bra och prestera?</strong></p>
          <p><br></p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">🤝 Samarbete och arbetsmiljö</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Trivsel och relationer till kollegor.</p>
          <p><strong>3. Hur fungerar samarbetet med dina kollegor? Något som kan fungera bättre?</strong></p>
          <p><br></p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">📈 Utveckling och lärande</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Motivation, engagemang och långsiktig kompetensutveckling.</p>

          <p><strong>4. Finns det områden i din nuvarande roll där du vill eller behöver utvecklas?</strong></p>
          <p><br></p>

          <p><strong>5. Hur vill du utvecklas på kort och lång sikt, finns det roller eller ansvarsområden som du är intresserad av?</strong></p>
          <p><br></p>

          <p><strong>6. Hur kan jag som chef bäst stötta dig i din utveckling och i ditt lärande?</strong></p>
          <p><br></p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">🎯 Mål och fokus framåt</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Måluppfyllnad under året, skapa en tydlig riktning och målsättning kommande år.</p>

          <p><strong>7. Hur har uppsatta mål uppnåtts?</strong></p>
          <p><br></p>

          <p><strong>8. Hur ser kommande mål ut?</strong></p>
          <p><br></p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">💬 Feedback/återkoppling till chef</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Öppen dialog om samarbete med närmsta chef.</p>
          <p><strong>9. Vad i samarbetet/dialogen med din chef tycker du fungerar bra? Finns det något som kan fungera bättre framåt?</strong></p>
          <p><br></p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">✨ Sammanfattning och överenskommelser</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Samsyn om samtalet och kommande period.</p>

          <p><strong>10. Finns det något mer som du vill ta upp och som vi inte har berört under samtalet?</strong></p>
          <p><br></p>

          <p><strong>11. Vilka är de viktigaste insikterna och slutsatserna från dagens samtal?</strong></p>
          <p><br></p>
        </div>
      </section>
    </div>
  </div>
</div>
`

// Karin's completed meeting notes (fleshed out)
const karinCompletedNotes = `
<div class="space-y-8">
  <div>
    <h1 class="text-3xl font-bold text-foreground mb-4">👋 Välkommen</h1>
    <p class="text-foreground/80 mb-8">Medarbetarsamtalet är ett planerat och strukturerat samtal med syfte att skapa dialog kring arbetssituation, prestation och utveckling. Samtalet ger oss möjlighet att stanna upp, reflektera och gemensamt blicka framåt. Under samtalet har vi en öppen dialog och ett gemensamt ansvar.</p>

    <p><br></p>

    <div class="space-y-8">
      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">🔄 Inledning, tillbakablick och nuläge</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p><strong>1. Hur upplever du din arbetssituation just nu? Vad tar och ger dig energi?</strong></p>
          <p>Karin känner sig mycket nöjd med sin roll som projektledare. Hon får energi av att se projekt komma i mål och teamet växa. Projekt Alpha var en höjdpunkt - levererat i tid och under budget!</p>
          <p>Det som tar energi är ibland stresspuckorna när deadlines närmar sig och teamet behöver mer stöttning. Hon känner att hon tar på sig lite för mycket själv i de lägena.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">📋 Arbetsuppgifter och ansvar</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Säkerställa tydlighet, rimlig arbetsbelastning, fokus och förutsättningar.</p>
          <p><strong>2. Vad är viktigt i jobbet för att du ska må bra och prestera?</strong></p>
          <p>Karin behöver tydliga ramar och mandat för att driva projekt framåt. Hon uppskattar förtroendet att fatta beslut själv, men vill kunna eskalera när det behövs.</p>
          <p>Viktigt är också att ha bra verktyg och stöd från ledningen. De nya projektrutinerna hon implementerat har gjort stor skillnad.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">🤝 Samarbete och arbetsmiljö</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Trivsel och relationer till kollegor.</p>
          <p><strong>3. Hur fungerar samarbetet med dina kollegor? Något som kan fungera bättre?</strong></p>
          <p>Samarbetet med utvecklingsteamet fungerar utmärkt! De nya standup-rutinerna har gjort kommunikationen mycket bättre. Teamet litar på henne och hon känner ett starkt teamarbete.</p>
          <p>Inget specifikt som behöver förbättras just nu - det flyter på bra.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">📈 Utveckling och lärande</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Motivation, engagemang och långsiktig kompetensutveckling.</p>

          <p><strong>4. Finns det områden i din nuvarande roll där du vill eller behöver utvecklas?</strong></p>
          <p>Karin vill bli bättre på att delegera. Hon tar ibland på sig för mycket själv istället för att fördela arbetet i teamet. Vi diskuterade att skapa en checklista för delegering.</p>
          <p><span data-task-chip="" data-task-id="task-karin-1" data-title="Skapa delegerings-checklista" data-type="task"></span></p>

          <p><strong>5. Hur vill du utvecklas på kort och lång sikt, finns det roller eller ansvarsområden som du är intresserad av?</strong></p>
          <p>Karin vill fördjupa sina kunskaper inom projektledning och tar sikte på PMP-certifiering under 2026. Hon är också intresserad av att lära sig mer om agila metoder på skalad nivå (SAFe).</p>
          <p>På längre sikt vill hon leda större, tvärfunktionella projekt som sträcker sig över flera team.</p>
          <p><span data-task-chip="" data-task-id="goal-karin-1" data-title="Ta PMP-certifiering" data-type="goal"></span></p>
          <p><span data-task-chip="" data-task-id="goal-karin-2" data-title="Leda tvärfunktionellt projekt" data-type="goal"></span></p>

          <p><strong>6. Hur kan jag som chef bäst stötta dig i din utveckling och i ditt lärande?</strong></p>
          <p>Karin skulle uppskatta stöd med att hitta en bra PMP-kurs och tid att studera. Också feedback när hon delegerar så att hon kan lära sig göra det bättre.</p>
          <p><span data-task-chip="" data-task-id="task-karin-2" data-title="Ta fram studieplan för PMP" data-type="task"></span></p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">🎯 Mål och fokus framåt</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Måluppfyllnad under året, skapa en tydlig riktning och målsättning kommande år.</p>

          <p><strong>7. Hur har uppsatta mål uppnåtts?</strong></p>
          <p>Projekt Alpha levererades i tid och under budget - fantastiskt resultat! Teamet är mycket nöjda med ledningen. Alla mål från förra året har uppnåtts.</p>

          <p><strong>8. Hur ser kommande mål ut?</strong></p>
          <p>Fokus framåt är att fortsätta leverera projekt i samma kvalitet, samtidigt som Karin utvecklar sin kompetens med PMP-certifiering. Också viktigt att förbättra resursplaneringen så att stress minskar vid deadlines.</p>
          <p><span data-task-chip="" data-task-id="task-karin-3" data-title="Granska resursplanering för Q1" data-type="task"></span></p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">💬 Feedback/återkoppling till chef</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Öppen dialog om samarbete med närmsta chef.</p>
          <p><strong>9. Vad i samarbetet/dialogen med din chef tycker du fungerar bra? Finns det något som kan fungera bättre framåt?</strong></p>
          <p>Karin uppskattar att Erik är tillgänglig och lyssnar. Hon får det mandat hon behöver och känner att hon får förtroende att driva sina projekt.</p>
          <p>Skulle vilja ha lite mer regelbundna 1:1 möten för att kunna bolla idéer och få feedback löpande.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">✨ Sammanfattning och överenskommelser</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Samsyn om samtalet och kommande period.</p>

          <p><strong>10. Finns det något mer som du vill ta upp och som vi inte har berört under samtalet?</strong></p>
          <p>Karin nämnde att hon är nyfiken på vad som händer med organisationsförändringar framöver, men inget brådskande.</p>

          <p><strong>11. Vilka är de viktigaste insikterna och slutsatserna från dagens samtal?</strong></p>
          <p>Karin har haft ett fantastiskt år med Projekt Alpha. Hon behöver jobba på delegering och ta fram en plan för PMP-certifiering. Vi ska också se över resursplanering för att minska stress vid deadlines. Fortsätt det goda arbetet!</p>
        </div>
      </section>
    </div>
  </div>
</div>`

// ========================================
// Mock Samtals (Detailed Data)
// ========================================

export const mockSamtals: Samtal[] = [
  // 1. Karin Larsson - Medarbetarsamtal (Klar/Completed)
  {
    id: 'samtal-karin-2025',
    name: 'Medarbetarsamtal: Karin Larsson',
    status: 'klar',
    type: 'Medarbetarsamtal',
    participants: [erikAxelsson, karinLarsson],
    conversationRound: 'Medarbetarsamtal 2025',
    deadlineDate: new Date('2025-12-31'),
    bookedDate: new Date('2025-11-20T10:00:00'),
    lastUpdated: new Date('2025-11-20'),
    notes: karinCompletedNotes,
    comments: [
      {
        id: 'c-karin-1',
        author: karinLarsson,
        text: 'Hej Erik! Inför vårt samtal ville jag lyfta några saker:\n\n**Vad fungerar bra:** Jag trivs verkligen med projektledarrollen och känner att jag växer i den. Samarbetet med utvecklingsteamet är fantastiskt.\n\n**Vill diskutera:** Jag funderar på att ta en PMP-certifiering nästa år - kan vi prata om möjligheterna för det? Också skulle jag vilja ta upp frågan om att eventuellt leda fler tvärfunktionella projekt.',
        timestamp: new Date('2025-11-18T14:00:00')
      },
      {
        id: 'c-karin-2',
        author: karinLarsson,
        text: 'Tack för ett givande samtal! Jag är glad att vi kunde diskutera PMP-certifieringen och jag ser fram emot att ta nästa steg. Känns bra att ha en tydlig plan framåt.',
        timestamp: new Date('2025-11-20T15:30:00')
      }
    ],
    metadata: { location: 'Rum 305' },
    duration: 60,
  },

  // 2. Lisa Svensson - Lönerevision (Ej bokad)
  {
    id: 'samtal-lisa-2025',
    name: 'Lönerevision: Lisa Svensson',
    status: 'ej_bokad',
    type: 'Lönerevision',
    participants: [erikAxelsson, lisaEriksson],
    conversationRound: 'Lön 2026',
    deadlineDate: new Date('2026-02-28'),
    lastUpdated: new Date('2025-11-20'),
    notes: salaryReviewAgenda,
    comments: [
      {
        id: 'c-lisa-1',
        author: lisaEriksson,
        text: 'Hej Erik! Jag har börjat sammanställa mina säljsiffror.',
        timestamp: new Date('2025-11-18T09:30:00')
      }
    ],
    metadata: { surveySource: 'Pulse Q4 2024' },
    duration: 60,
  },

  // 3. Marcus Lindqvist - Lönerevision (Bokad but performed - needs marking as done)
  {
    id: 'samtal-marcus-2025',
    name: 'Lönerevision: Marcus Lindqvist',
    status: 'bokad',
    type: 'Lönerevision',
    participants: [erikAxelsson, marcusLindqvist],
    conversationRound: 'Lön 2025',
    deadlineDate: new Date('2025-12-31'),
    bookedDate: new Date('2025-11-25T10:00:00'), // Meeting was on 25 Nov - needs marking as done
    lastUpdated: new Date('2025-11-25'),
    notes: marcusCompletedNotes, // Rich notes with manager's private reflections
    comments: [
      {
        id: 'c-marcus-1',
        author: marcusLindqvist,
        text: 'Jag har en fråga om bonusmodellen, tar vi det på mötet?',
        timestamp: new Date('2025-11-22T10:00:00')
      },
      {
        id: 'c-marcus-2',
        author: marcusLindqvist,
        text: 'Tack för ett bra samtal Erik! Jag uppskattar verkligen att ni värdesätter mitt arbete. Ser fram emot att ta mer ansvar för QA-strategin framöver.',
        timestamp: new Date('2025-11-25T11:30:00')
      }
    ],
    metadata: { location: 'Rum 201' },
    duration: 45,
  },

  // 4. Anna Andersson - Medarbetarsamtal (Bokad/Ongoing)
  {
    id: 'samtal-anna-2025',
    name: 'Medarbetarsamtal: Anna Andersson',
    status: 'bokad',
    type: 'Medarbetarsamtal',
    participants: [erikAxelsson, annaAndersson],
    conversationRound: 'Medarbetarsamtal 2025',
    deadlineDate: new Date('2025-12-31'),
    bookedDate: new Date('2025-12-16T12:00:00'), // 16 Dec 2025 at 12:00
    lastUpdated: new Date(),
    notes: medarbetarsamtalTemplate,
    comments: [
      {
        id: 'c-anna-prep',
        author: annaAndersson,
        text: 'Hej Erik!\n\nHär är mina förberedelser inför samtalet.\n\nReflektion senaste året:\nJag är stolt över rekryteringsarbetet - vi har byggt ett starkt team! Onboarding-processen känns nu mycket smidigare.\n\nVill prata om:\n• Min utveckling mot mer strategiskt HR-arbete\n• Möjlighet till CIPD-certifiering\n• Arbetsbelastning under rekryteringstoppar\n\nFråga:\nHur ser du på att jag tar ett större ansvar för employer branding framöver?',
        timestamp: new Date('2025-12-15T14:30:00') // 3 days ago
      }
    ],
    metadata: { location: 'Rum 302' },
    duration: 60,
  },

  // 5. Erik Danielsson - Medarbetarsamtal (Bokad)
  {
    id: 'samtal-erik-d-2025',
    name: 'Medarbetarsamtal: Erik Danielsson',
    status: 'bokad',
    type: 'Medarbetarsamtal',
    participants: [erikAxelsson, erikDanielsson],
    conversationRound: 'Medarbetarsamtal 2025',
    deadlineDate: new Date('2025-12-31'),
    bookedDate: new Date('2025-12-18T14:00:00'), // 18 Dec 2025 at 14:00
    lastUpdated: new Date(),
    notes: medarbetarsamtalTemplate,
    comments: [
      {
        id: 'c-erik-d-prep',
        author: erikDanielsson,
        text: 'Hej Erik!\n\nSer fram emot vårt samtal! Har förberett några punkter:\n\n✨ Höjdpunkter:\n- Kampanjen för nya produktlanseringen gick över förväntan\n- Bra samarbete med säljteamet\n\n💭 Vill diskutera:\n• Karriärutveckling inom digital marknadsföring\n• Möjlighet att leda fler projekt\n• Balans mellan kreativt arbete och administration\n\nVi ses!',
        timestamp: new Date('2025-12-16T10:00:00')
      }
    ],
    metadata: { location: 'Rum 305' },
    duration: 60,
  },

  // 6. David Persson - Lönerevision (Klar)
  {
    id: 'samtal-david-2025',
    name: 'Lönerevision: David Persson',
    status: 'klar',
    type: 'Lönerevision',
    participants: [mariaNilsson, davidPersson],
    conversationRound: 'Lön 2025',
    deadlineDate: new Date('2025-08-31'),
    bookedDate: new Date('2025-08-10T13:30:00'),
    lastUpdated: new Date('2025-08-11'),
    notes: `<h1>💰 Lönesamtal</h1>
<h2>📊 Prestationsöversikt</h2>
<ul>
  <li>David har levererat stabilt under året.</li>
  <li>Databasoptimeringen var en höjdpunkt.</li>
</ul>
<h2>🎯 Framtida förväntningar</h2>
<ul>
  <li>Fortsatt fokus på prestanda.</li>
  <li><span data-task-chip="" data-task-id="goal-david-1" data-title="Optimera databasprestanda" data-type="goal"></span></li>
</ul>
<h2>💰 Löneöversyn</h2>
<p>Lönejustering på 4.2% överenskommen.</p>`,
    comments: [
      {
        id: 'c-david-1',
        author: davidPersson,
        text: 'Tack Maria, jag är nöjd med utfallet.',
        timestamp: new Date('2025-08-11T09:00:00')
      }
    ],
    metadata: {},
    duration: 45,
  },
]

// ========================================
// Derived Conversation List
// ========================================

export const mockConversationList: ConversationListItem[] = mockSamtals.map(samtal => {
  let listStatus: ConversationListItem['status'] = 'Ej bokad'
  if (samtal.status === 'klar') listStatus = 'Genomförd'
  if (samtal.status === 'bokad') listStatus = 'Bokad'
  if (samtal.status === 'planerad') listStatus = 'Planerad'

  return {
    id: samtal.id,
    name: samtal.name,
    participants: samtal.participants,
    type: samtal.type,
    role: 'Deltagare',
    status: listStatus,
    bookedTime: samtal.bookedDate ? samtal.bookedDate.toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' }) : undefined,
    deadline: samtal.deadlineDate.toLocaleDateString('sv-SE'),
    icon: samtal.type === 'Lönerevision' ? '$' : '📋',
    conversationRoundName: samtal.conversationRound,
  }
})

export const currentSamtal: Samtal = mockSamtals[0]

export const defaultAgendaTemplate = salaryReviewAgenda

// ========================================
// Tasks & Goals
// ========================================

export const mockTasks: Task[] = [
  // ========================================
  // ANNA ANDERSSON - Ongoing tasks (from previous conversations)
  // "Nya" section only shows tasks created DURING the current call via editor
  // ========================================
  {
    id: 'goal-anna-1',
    type: 'goal',
    title: 'Utvecklas mot strategiskt HR-arbete',
    description: 'Ta större ansvar för strategiska HR-frågor och employer branding',
    status: 'pending',
    goalStatus: 'gar_enligt_plan',
    due: new Date('2026-06-30'),
    assignee: annaAndersson as unknown as User,
    createdAt: new Date('2025-01-15'),
    origin: { conversationId: 'hist-anna-2024', conversationTitle: 'Medarbetarsamtal 2024' },
    statusHistory: [
      {
        id: 'update-anna-1-3',
        status: 'gar_enligt_plan',
        comment: 'Har börjat arbeta mer med strategiska frågor. Inledde employer branding-projektet med gott resultat.',
        user: annaAndersson as unknown as User,
        timestamp: new Date('2025-11-10T10:00:00')
      },
      {
        id: 'update-anna-1-2',
        status: 'gar_enligt_plan',
        comment: 'Bra framsteg! Anna deltar nu aktivt i ledningsgruppsmöten och bidrar med HR-perspektiv.',
        user: erikAxelsson as unknown as User,
        timestamp: new Date('2025-08-15T14:30:00')
      },
      {
        id: 'update-anna-1-1',
        status: null,
        comment: 'Målbilden är satt, börjar nu kartlägga vilka strategiska initiativ som behövs.',
        user: annaAndersson as unknown as User,
        timestamp: new Date('2025-02-01T09:00:00')
      }
    ]
  },
  {
    id: 'goal-anna-2',
    type: 'goal',
    title: 'Ta CIPD-certifiering',
    description: 'Genomföra CIPD Level 5 certifiering för att fördjupa HR-kompetensen',
    status: 'pending',
    goalStatus: null,
    due: new Date('2026-12-31'),
    assignee: annaAndersson as unknown as User,
    createdAt: new Date('2025-01-15'),
    origin: { conversationId: 'hist-anna-2024', conversationTitle: 'Medarbetarsamtal 2024' },
  },
  {
    id: 'task-anna-1',
    type: 'task',
    title: 'Skapa employer branding-strategi',
    description: 'Ta fram en strategi för employer branding inför 2026',
    status: 'pending',
    due: new Date('2025-12-15'),
    assignee: annaAndersson as unknown as User,
    createdAt: new Date('2025-01-15'),
    origin: { conversationId: 'hist-anna-2024', conversationTitle: 'Medarbetarsamtal 2024' },
  },
  {
    id: 'task-anna-2',
    type: 'task',
    title: 'Undersök CIPD-kurser',
    description: 'Researcha och presentera olika CIPD-kursalternativ',
    status: 'pending',
    due: new Date('2025-12-20'),
    assignee: annaAndersson as unknown as User,
    createdAt: new Date('2025-01-15'),
    origin: { conversationId: 'hist-anna-2024', conversationTitle: 'Medarbetarsamtal 2024' },
  },
  {
    id: 'goal-anna-ongoing-1',
    type: 'goal',
    title: 'Förbättra onboarding-upplevelsen',
    description: 'Höja NPS-score för onboarding från 7.5 till 9.0',
    status: 'pending',
    goalStatus: 'gar_enligt_plan',
    due: new Date('2025-12-31'),
    assignee: annaAndersson as unknown as User,
    createdAt: new Date('2025-01-15'),
    origin: { conversationId: 'hist-anna-2024', conversationTitle: 'Medarbetarsamtal 2024' },
    statusHistory: [
      {
        id: 'update-onboard-2',
        status: 'gar_enligt_plan',
        comment: 'NPS ligger nu på 8.2! Nya welcome-kitet har fått fantastisk feedback. Kör vidare mot 9.0.',
        user: erikAxelsson as unknown as User,
        timestamp: new Date('2025-10-15T11:00:00')
      },
      {
        id: 'update-onboard-1',
        status: 'ligger_efter',
        comment: 'Fick lägre NPS än förväntat (7.8). Feedback visar att vi behöver bättre struktur första veckan.',
        user: annaAndersson as unknown as User,
        timestamp: new Date('2025-05-20T14:00:00')
      }
    ]
  },
  {
    id: 'task-anna-ongoing-1',
    type: 'task',
    title: 'Uppdatera rekryteringsmallar',
    description: 'Se över och uppdatera alla rekryteringsmallar',
    status: 'pending',
    due: new Date('2025-12-01'),
    assignee: annaAndersson as unknown as User,
    createdAt: new Date('2025-06-15'),
    origin: { conversationId: 'hist-anna-2024', conversationTitle: 'Medarbetarsamtal 2024' },
  },

  // Anna - Completed historical
  {
    id: 'goal-hist-anna-1',
    type: 'goal',
    title: 'Rekrytera 5 utvecklare',
    status: 'completed',
    goalStatus: 'uppnatt',
    due: new Date('2024-12-31'),
    assignee: annaAndersson as unknown as User,
    createdAt: new Date('2024-01-15'),
    origin: { conversationId: 'hist-anna-2024', conversationTitle: 'Medarbetarsamtal 2024' },
  },
  {
    id: 'goal-hist-anna-2',
    type: 'goal',
    title: 'Implementera nytt ATS-system',
    description: 'Utvärdera och implementera ett modernt ATS-system',
    status: 'completed',
    goalStatus: 'uppnatt',
    due: new Date('2024-09-30'),
    assignee: annaAndersson as unknown as User,
    createdAt: new Date('2024-01-15'),
    origin: { conversationId: 'hist-anna-2024', conversationTitle: 'Medarbetarsamtal 2024' },
  },
  {
    id: 'task-hist-anna-1',
    type: 'task',
    title: 'Skapa onboarding-handbok',
    description: 'Dokumentera onboarding-processen',
    status: 'completed',
    due: new Date('2024-04-30'),
    assignee: annaAndersson as unknown as User,
    createdAt: new Date('2024-01-15'),
    origin: { conversationId: 'hist-anna-2024', conversationTitle: 'Medarbetarsamtal 2024' },
  },
  {
    id: 'task-hist-anna-2',
    type: 'task',
    title: 'Gå People Analytics-kurs',
    status: 'completed',
    due: new Date('2024-05-31'),
    assignee: annaAndersson as unknown as User,
    createdAt: new Date('2024-01-15'),
    origin: { conversationId: 'hist-anna-2024', conversationTitle: 'Medarbetarsamtal 2024' },
  },

  // ========================================
  // KARIN LARSSON - Tasks from completed conversation
  // ========================================
  {
    id: 'goal-karin-1',
    type: 'goal',
    title: 'Ta PMP-certifiering',
    description: 'Genomföra PMP-certifiering under 2026',
    status: 'pending',
    goalStatus: null,
    due: new Date('2026-06-30'),
    assignee: karinLarsson as unknown as User,
    createdAt: new Date('2025-11-20'),
    origin: { conversationId: 'samtal-karin-2025', conversationTitle: 'Medarbetarsamtal 2025' },
  },
  {
    id: 'task-karin-1',
    type: 'task',
    title: 'Ta fram studieplan för PMP',
    description: 'Skapa en studieplan och budget för PMP-certifiering',
    status: 'pending',
    due: new Date('2025-12-31'),
    assignee: karinLarsson as unknown as User,
    createdAt: new Date('2025-11-20'),
    origin: { conversationId: 'samtal-karin-2025', conversationTitle: 'Medarbetarsamtal 2025' },
  },
  {
    id: 'goal-hist-karin-1',
    type: 'goal',
    title: 'Certifiering i Projektledning',
    status: 'completed',
    goalStatus: 'uppnatt',
    due: new Date('2024-12-31'),
    assignee: karinLarsson as unknown as User,
    createdAt: new Date('2024-01-15'),
    origin: { conversationId: 'hist-karin-2024', conversationTitle: 'Medarbetarsamtal 2024' },
  },

  // ========================================
  // OTHER PARTICIPANTS
  // ========================================
  {
    id: 'goal-david-1',
    type: 'goal',
    title: 'Optimera databasprestanda',
    description: 'Minska svarstider med 20%',
    status: 'pending',
    goalStatus: 'gar_enligt_plan',
    due: new Date('2025-12-31'),
    assignee: davidPersson as unknown as User,
    createdAt: new Date('2025-01-09'),
    origin: { conversationId: 'samtal-david-2025', conversationTitle: 'Lönerevision 2025' },
  },
  {
    id: 'goal-hist-lisa-1',
    type: 'goal',
    title: 'Öka försäljning Q3 2024',
    status: 'completed',
    goalStatus: 'uppnatt',
    due: new Date('2024-09-30'),
    assignee: lisaEriksson as unknown as User,
    createdAt: new Date('2024-01-15'),
    origin: { conversationId: 'hist-lisa-2024', conversationTitle: 'Lönerevision 2024' },
  },
  {
    id: 'goal-hist-marcus-1',
    type: 'goal',
    title: 'Automatisera testsvit',
    status: 'completed',
    goalStatus: 'uppnatt',
    due: new Date('2024-06-30'),
    assignee: marcusLindqvist as unknown as User,
    createdAt: new Date('2024-01-20'),
    origin: { conversationId: 'hist-marcus-2024', conversationTitle: 'Lönerevision 2024' },
  },

  // ========================================
  // MARCUS LINDQVIST - Tasks from current Lönerevision 2025 (performed 25 Nov)
  // ========================================
  {
    id: 'goal-marcus-2025-1',
    type: 'goal',
    title: 'Leda QA-strategiarbetet',
    description: 'Ta ledande ansvar för QA-strategi och processutveckling inom teamet',
    status: 'pending',
    goalStatus: null,
    due: new Date('2026-06-30'),
    assignee: marcusLindqvist as unknown as User,
    createdAt: new Date('2025-11-25'),
    origin: { conversationId: 'samtal-marcus-2025', conversationTitle: 'Lönerevision 2025' },
  },
  {
    id: 'goal-marcus-2025-2',
    type: 'goal',
    title: 'Uppnå 85% testtäckning',
    description: 'Höja testtäckningen från nuvarande 78% till 85% genom utökad automatisering',
    status: 'pending',
    goalStatus: null,
    due: new Date('2026-03-31'),
    assignee: marcusLindqvist as unknown as User,
    createdAt: new Date('2025-11-25'),
    origin: { conversationId: 'samtal-marcus-2025', conversationTitle: 'Lönerevision 2025' },
  },
  {
    id: 'task-marcus-2025-1',
    type: 'task',
    title: 'Skapa QA roadmap för Q1',
    description: 'Ta fram en konkret plan för QA-arbetet under Q1 2026',
    status: 'pending',
    due: new Date('2025-12-15'),
    assignee: marcusLindqvist as unknown as User,
    createdAt: new Date('2025-11-25'),
    origin: { conversationId: 'samtal-marcus-2025', conversationTitle: 'Lönerevision 2025' },
  },
]

// ========================================
// Historical Meetings
// ========================================

export const mockHistoricalMeetings: HistoricalMeeting[] = [
  // 1. Karin Larsson History (Medarbetarsamtal)
  {
    id: 'hist-karin-2024',
    title: 'Medarbetarsamtal 2024',
    date: new Date('2024-03-15T10:00:00'),
    participants: [erikAxelsson, karinLarsson],
    status: 'completed',
    duration: 60,
    type: 'Medarbetarsamtal',
    agendaContent: `
<div class="space-y-8">
  <div>
    <h1 class="text-3xl font-bold text-foreground mb-4">👋 Välkommen</h1>
    <p class="text-foreground/80 mb-8">Medarbetarsamtalet är ett planerat och strukturerat samtal med syfte att skapa dialog kring arbetssituation, prestation och utveckling. Samtalet ger oss möjlighet att stanna upp, reflektera och gemensamt blicka framåt. Under samtalet har vi en öppen dialog och ett gemensamt ansvar.</p>

    <p><br></p>

    <div class="space-y-8">
      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">🔄 Inledning, tillbakablick och nuläge</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p><strong>1. Hur upplever du din arbetssituation just nu? Vad tar och ger dig energi?</strong></p>
          <p>Karin mår bra och känner sig bekväm i sin roll. Projekt Alpha har varit utmanande men väldigt givande. Hon får energi av att leda team och se saker bli verklighet.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">📋 Arbetsuppgifter och ansvar</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Säkerställa tydlighet, rimlig arbetsbelastning, fokus och förutsättningar.</p>
          <p><strong>2. Vad är viktigt i jobbet för att du ska må bra och prestera?</strong></p>
          <p>Tydliga ramar och mandat. Karin behöver veta att hon har stöd från ledningen när hon fattar beslut.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">🤝 Samarbete och arbetsmiljö</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Trivsel och relationer till kollegor.</p>
          <p><strong>3. Hur fungerar samarbetet med dina kollegor? Något som kan fungera bättre?</strong></p>
          <p>Bra samarbete med teamet. Ingen större anmärkning. Möjligen lite mer struktur i kommunikationen framöver.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">📈 Utveckling och lärande</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Motivation, engagemang och långsiktig kompetensutveckling.</p>

          <p><strong>4. Finns det områden i din nuvarande roll där du vill eller behöver utvecklas?</strong></p>
          <p>Karin vill lära sig mer om projektledningsmetodik formellt. Hon har erfarenhet men saknar certifiering.</p>

          <p><strong>5. Hur vill du utvecklas på kort och lång sikt, finns det roller eller ansvarsområden som du är intresserad av?</strong></p>
          <p>Karin vill ta certifiering i projektledning och på sikt ta mer ansvar för budget och ekonomistyrning.</p>
          <p><span data-task-chip="" data-task-id="goal-hist-karin-1" data-title="Certifiering i Projektledning" data-type="goal"></span></p>

          <p><strong>6. Hur kan jag som chef bäst stötta dig i din utveckling och i ditt lärande?</strong></p>
          <p>Stöd med utbildning och möjlighet att jobba med budgetansvar i kommande projekt.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">🎯 Mål och fokus framåt</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Måluppfyllnad under året, skapa en tydlig riktning och målsättning kommande år.</p>

          <p><strong>7. Hur har uppsatta mål uppnåtts?</strong></p>
          <p>Projekt Alpha levererades framgångsrikt. Karin visade starkt ledarskap och fick positiv feedback från teamet.</p>

          <p><strong>8. Hur ser kommande mål ut?</strong></p>
          <p>Ta certifiering och börja jobba med budget i nästa projekt.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">💬 Feedback/återkoppling till chef</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Öppen dialog om samarbete med närmsta chef.</p>
          <p><strong>9. Vad i samarbetet/dialogen med din chef tycker du fungerar bra? Finns det något som kan fungera bättre framåt?</strong></p>
          <p>Erik är lyhörd och ger bra stöd. Fungerar bra.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">✨ Sammanfattning och överenskommelser</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Samsyn om samtalet och kommande period.</p>

          <p><strong>10. Finns det något mer som du vill ta upp och som vi inte har berört under samtalet?</strong></p>
          <p>Inget särskilt just nu.</p>

          <p><strong>11. Vilka är de viktigaste insikterna och slutsatserna från dagens samtal?</strong></p>
          <p>Karin har levererat starkt. Nästa steg är certifiering och mer budgetansvar. Bra år framöver!</p>
        </div>
      </section>
    </div>
  </div>
</div>`,
    aiSummary: {
      overview: 'Ett positivt medarbetarsamtal med Karin Larsson. Karin mår bra i sin roll och fick energi av att leda Projekt Alpha. Hon vill formalisera sin projektledningskompetens med certifiering och på sikt ta mer budgetansvar.',
      keyDiscussions: [
        'Karin upplever arbetssituationen positivt och får energi av att leda team och se projekt bli verklighet.',
        'Samarbetet fungerar bra men mer struktur i kommunikationen önskas.',
        'Vill ta certifiering i projektledning och få mer budgetansvar i kommande projekt.',
        'Uppskattar stöd och lyhördhet från chef. Inga förbättringsområden lyfta.'
      ],
      managerNotes: [
        'Karin är redo för en senior roll - ge henne möjlighet till certifiering och budgetansvar',
        'Projekt Alpha levererades framgångsrikt under hennes ledning',
        'Stöd med utbildning och möjlighet att jobba med budget i nästa projekt'
      ],
      surveyInsights: [],
      goalsAndTasks: {
        goals: [{ title: 'Certifiering i Projektledning', status: 'completed', origin: { conversationId: 'hist-karin-2024' } }],
        tasks: []
      },
      nextSteps: [
        'Hitta lämplig certifieringskurs i projektledning',
        'Ge Karin budgetansvar i nästa projekt',
        'Uppföljning av certifieringsframsteg vid nästa samtal'
      ]
    },
    comments: [
      {
        id: 'c-hist-karin-1',
        author: karinLarsson,
        text: 'Tack för stödet under året!',
        timestamp: new Date('2024-03-16T09:00:00')
      }
    ]
  },

  // 2. Lisa Svensson History (Lönerevision)
  {
    id: 'hist-lisa-2024',
    title: 'Lönerevision 2024',
    date: new Date('2024-02-20T11:00:00'),
    participants: [erikAxelsson, lisaEriksson],
    status: 'completed',
    duration: 45,
    type: 'Lönerevision',
    agendaContent: `<h1>💰 Lönesamtal</h1>
<h2>📊 Prestationsöversikt</h2>
<ul>
  <li>Lisa har överträffat säljmålen med 15%.</li>
</ul>
<h2>🎯 Framtida förväntningar</h2>
<ul>
  <li>Fortsatt fokus på storkunder.</li>
  <li><span data-task-chip="" data-task-id="goal-hist-lisa-1" data-title="Öka försäljning Q3 2024" data-type="goal"></span></li>
</ul>
<h2>💰 Löneöversyn</h2>
<p>Löneökning 5%.</p>`,
    aiSummary: {
      overview: 'Lönerevision med Lisa Svensson. Lisa har haft ett starkt säljår och överträffade sina försäljningsmål med 15%. Fokus framåt ligger på att fortsätta växa storkundsportföljen. Löneökning på 5% överenskommen.',
      keyDiscussions: [
        'Lisa överträffade sina försäljningsmål med 15% under året.',
        'Fortsatt fokus på storkunder som strategisk prioritering.',
        'Löneökning på 5% beslutad baserat på stark prestation.'
      ],
      managerNotes: [
        'Lisa levererar konsekvent över förväntan - viktig att behålla',
        'Storkunder är rätt fokus, stötta med resurser vid behov',
        '5% löneökning motiverad av starka resultat'
      ],
      surveyInsights: [],
      goalsAndTasks: {
        goals: [{ title: 'Öka försäljning Q3 2024', status: 'completed', origin: { conversationId: 'hist-lisa-2024' } }],
        tasks: []
      },
      nextSteps: [
        'Uppföljning av storkundsstrategi i Q2',
        'Bekräfta lönejustering med HR'
      ]
    },
    comments: [
      {
        id: 'c-hist-lisa-1',
        author: lisaEriksson,
        text: 'Nöjd med samtalet.',
        timestamp: new Date('2024-02-20T13:00:00')
      }
    ]
  },

  // 3. Marcus Lindqvist History (Lönerevision)
  {
    id: 'hist-marcus-2024',
    title: 'Lönerevision 2024',
    date: new Date('2024-02-22T10:00:00'),
    participants: [erikAxelsson, marcusLindqvist],
    status: 'completed',
    duration: 40,
    type: 'Lönerevision',
    agendaContent: `<h1>💰 Lönesamtal</h1>
<h2>📊 Prestationsöversikt</h2>
<ul>
  <li>Marcus har förbättrat testtäckningen avsevärt.</li>
</ul>
<h2>🎯 Framtida förväntningar</h2>
<ul>
  <li>Automatisering är prio.</li>
  <li><span data-task-chip="" data-task-id="goal-hist-marcus-1" data-title="Automatisera testsvit" data-type="goal"></span></li>
</ul>
<h2>💰 Löneöversyn</h2>
<p>Löneökning 4%.</p>`,
    aiSummary: {
      overview: 'Lönerevision med Marcus Lindqvist. Marcus har förbättrat testtäckningen avsevärt under året och levererar konsekvent hög kvalitet. Automatisering av testsviten prioriteras framåt. Löneökning på 4% överenskommen.',
      keyDiscussions: [
        'Marcus har förbättrat testtäckningen avsevärt under året.',
        'Automatisering av testsviten är nästa steg och högsta prioritet.',
        'Löneökning på 4% beslutad baserat på kvalitetsförbättringar.'
      ],
      managerNotes: [
        'Marcus är pålitlig och levererar hög kvalitet konsekvent',
        'Automatisering av testsviten ger stor affärsvärde - stötta med tid och resurser',
        '4% löneökning motiverad av förbättrad testtäckning och stabilitet'
      ],
      surveyInsights: [],
      goalsAndTasks: {
        goals: [{ title: 'Automatisera testsvit', status: 'completed', origin: { conversationId: 'hist-marcus-2024' } }],
        tasks: []
      },
      nextSteps: [
        'Påbörja automatiseringsprojektet under Q2',
        'Uppföljning av testtäckningsmetrik kvartalsvis'
      ]
    },
    comments: [
      {
        id: 'c-hist-marcus-1',
        author: marcusLindqvist,
        text: 'Tack för feedbacken.',
        timestamp: new Date('2024-02-22T11:00:00')
      }
    ]
  },

  // 4. Anna Andersson History (Medarbetarsamtal 2024)
  {
    id: 'hist-anna-2024',
    title: 'Medarbetarsamtal 2024',
    date: new Date('2024-01-15T13:00:00'),
    participants: [erikAxelsson, annaAndersson],
    status: 'completed',
    duration: 55,
    type: 'Medarbetarsamtal',
    agendaContent: `
<div class="space-y-8">
  <div>
    <h1 class="text-3xl font-bold text-foreground mb-4">👋 Välkommen</h1>
    <p class="text-foreground/80 mb-8">Medarbetarsamtalet är ett planerat och strukturerat samtal med syfte att skapa dialog kring arbetssituation, prestation och utveckling. Samtalet ger oss möjlighet att stanna upp, reflektera och gemensamt blicka framåt. Under samtalet har vi en öppen dialog och ett gemensamt ansvar.</p>

    <p><br></p>

    <div class="space-y-8">
      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">🔄 Inledning, tillbakablick och nuläge</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p><strong>1. Hur upplever du din arbetssituation just nu? Vad tar och ger dig energi?</strong></p>
          <p>Anna känner sig väldigt nöjd med 2023! Hon får energi av att bygga upp rekryteringsprocesser och se nya kollegor komma in. Särskilt roligt när kandidater berömmer vår rekryteringsupplevelse.</p>
          <p>Det som tar energi är perioder med många öppna tjänster samtidigt - kan bli rörigt och intensivt.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">📋 Arbetsuppgifter och ansvar</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Säkerställa tydlighet, rimlig arbetsbelastning, fokus och förutsättningar.</p>
          <p><strong>2. Vad är viktigt i jobbet för att du ska må bra och prestera?</strong></p>
          <p>Anna behöver tydlighet om prioriteringar när det är många rekryteringar samtidigt. Också viktigt med bra verktyg - nuvarande ATS:et är lite begränsande.</p>
          <p>Hon uppskattar att ha ett nära samarbete med cheferna för att förstå exakt vad de söker.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">🤝 Samarbete och arbetsmiljö</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Trivsel och relationer till kollegor.</p>
          <p><strong>3. Hur fungerar samarbetet med dina kollegor? Något som kan fungera bättre?</strong></p>
          <p>Samarbetet är jättebra! Anna har byggt starka relationer med alla chefer. Hon känner att hon har förtroende och blir lyssnad på.</p>
          <p>Inget specifikt att förbättra - det fungerar väldigt bra.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">📈 Utveckling och lärande</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Motivation, engagemang och långsiktig kompetensutveckling.</p>

          <p><strong>4. Finns det områden i din nuvarande roll där du vill eller behöver utvecklas?</strong></p>
          <p>Anna vill bli bättre på att delegera - hon tar ibland på sig för mycket själv. Också vill hon lära sig säga nej när arbetsbelastningen blir för hög.</p>
          <p>Hon vill också strukturera onboarding-processen bättre.</p>
          <p><span data-task-chip="" data-task-id="task-hist-anna-1" data-title="Skapa onboarding-handbok" data-type="task"></span></p>

          <p><strong>5. Hur vill du utvecklas på kort och lång sikt, finns det roller eller ansvarsområden som du är intresserad av?</strong></p>
          <p>Anna vill fördjupa sig inom strategiskt HR-arbete och People Analytics. Hon är intresserad av att gå från operativt till mer strategiskt fokus på längre sikt.</p>
          <p>Också intresserad av DEI-arbete (Diversity, Equity & Inclusion) för att stärka vår rekrytering.</p>

          <p><strong>6. Hur kan jag som chef bäst stötta dig i din utveckling och i ditt lärande?</strong></p>
          <p>Anna skulle uppskatta stöd med att gå en kurs i People Analytics under våren. Också bra med regelbundna diskussioner om strategiska HR-frågor.</p>
          <p><span data-task-chip="" data-task-id="task-hist-anna-2" data-title="Gå People Analytics-kurs" data-type="task"></span></p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">🎯 Mål och fokus framåt</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Måluppfyllnad under året, skapa en tydlig riktning och målsättning kommande år.</p>

          <p><strong>7. Hur har uppsatta mål uppnåtts?</strong></p>
          <p>Anna har levererat fantastiskt! Byggt upp solid rekryteringsprocess och fått positiv Glassdoor-feedback. Employer branding-arbetet har gett 40% fler spontanansökningar.</p>
          <p>Kandidatupplevelsen får konsekvent högt beröm från intervjuade kandidater.</p>

          <p><strong>8. Hur ser kommande mål ut?</strong></p>
          <p>Vi behöver växa teknikteamet rejält under 2024. Anna tar ansvar för att rekrytera 5 nya utvecklare, med fokus på seniora profiler.</p>
          <p>Också implementera ett nytt ATS-system för att effektivisera processen.</p>
          <p><span data-task-chip="" data-task-id="goal-hist-anna-1" data-title="Rekrytera 5 utvecklare" data-type="goal"></span></p>
          <p><span data-task-chip="" data-task-id="goal-hist-anna-2" data-title="Implementera nytt ATS-system" data-type="goal"></span></p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">💬 Feedback/återkoppling till chef</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Öppen dialog om samarbete med närmsta chef.</p>
          <p><strong>9. Vad i samarbetet/dialogen med din chef tycker du fungerar bra? Finns det något som kan fungera bättre framåt?</strong></p>
          <p>Anna uppskattar förtroendet och flexibiliteten hon får. Erik är lyhörd och stöttande.</p>
          <p>Inget särskilt att förbättra - samarbetet fungerar jättebra.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">✨ Sammanfattning och överenskommelser</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Samsyn om samtalet och kommande period.</p>

          <p><strong>10. Finns det något mer som du vill ta upp och som vi inte har berört under samtalet?</strong></p>
          <p>Anna nämnde enkätresultaten - hon fick höga betyg på samarbete (4.8/5) och tillgänglighet (4.6/5). Work-life balance (3.5/5) kopplat till arbetsbelastningen vi diskuterade.</p>
          <p>Också att hon trivs mycket bra och uppskattar teamet och kulturen. Arbetsbelastningen hanteras med bättre planering.</p>

          <p><strong>11. Vilka är de viktigaste insikterna och slutsatserna från dagens samtal?</strong></p>
          <p>Anna har haft ett fantastiskt 2023 med stark rekryteringsprocess och employer branding-resultat. 2024 fokuserar vi på 5 utvecklarrekryteringar och nytt ATS-system. Anna ska jobba på att delegera mer och gå People Analytics-kurs. Fortsätt det fantastiska arbetet!</p>
        </div>
      </section>
    </div>
  </div>
</div>`,
    aiSummary: {
      overview: 'Ett mycket positivt medarbetarsamtal med Anna där vi reflekterade över hennes starka insatser under 2023 och satte ambitiösa mål för 2024. Anna har varit instrumental i att bygga vår rekryteringsprocess och employer branding. Fokus framåt ligger på att skala upp rekryteringen för teknikteamet.',
      keyDiscussions: [
        'Rekryteringsframgångar under 2023 - 40% ökning av spontanansökningar',
        'Positiv feedback på kandidatupplevelsen från Glassdoor',
        'Behov av att delegera mer och hantera arbetsbelastning',
        'Utveckling inom People Analytics och strategiskt HR-arbete'
      ],
      managerNotes: [
        'Anna är en nyckelperson för vår expansion - säkerställ att hon får stöd',
        'Viktigt att hon lär sig delegera för att undvika utbrändhet',
        'Överväg att utöka HR-teamet för att avlasta Anna'
      ],
      surveyInsights: [
        'Höga betyg på samarbete (4.8/5) och tillgänglighet (4.6/5)',
        'Work-life balance (3.5/5) bör adresseras'
      ],
      goalsAndTasks: {
        goals: [
          { title: 'Rekrytera 5 utvecklare', status: 'completed', origin: { conversationId: 'hist-anna-2024' } },
          { title: 'Implementera nytt ATS-system', status: 'completed', origin: { conversationId: 'hist-anna-2024' } }
        ],
        tasks: [
          { title: 'Skapa onboarding-handbok', status: 'completed', origin: { conversationId: 'hist-anna-2024' } },
          { title: 'Gå People Analytics-kurs', status: 'completed', origin: { conversationId: 'hist-anna-2024' } }
        ]
      },
      nextSteps: [
        'Följ upp rekryteringsmål kvartalsvis',
        'Boka in People Analytics-kurs i mars',
        'Diskutera eventuell utökning av HR-teamet vid nästa 1:1'
      ]
    },
    comments: [
      {
        id: 'c-hist-anna-prep',
        author: annaAndersson,
        text: 'Hej Erik! Inför samtalet ville jag lyfta:\n\n**Stolt över:** Kandidatupplevelsen vi byggt - fick 5 stjärnor på Glassdoor!\n\n**Vill diskutera:** Hur vi ska hantera rekryteringsbehovet 2024, och min egen utveckling mot mer strategiskt arbete.',
        timestamp: new Date('2024-01-14T10:00:00')
      },
      {
        id: 'c-hist-anna-1',
        author: annaAndersson,
        text: 'Tack för ett bra samtal! Det var skönt att prata om arbetsbelastningen. Jag ska verkligen försöka delegera mer. Ser fram emot People Analytics-kursen!',
        timestamp: new Date('2024-01-15T15:00:00')
      }
    ]
  },

  // 4b. Anna Andersson History (Medarbetarsamtal 2023)
  {
    id: 'hist-anna-2023',
    title: 'Medarbetarsamtal 2023',
    date: new Date('2023-02-10T14:00:00'),
    participants: [erikAxelsson, annaAndersson],
    status: 'completed',
    duration: 50,
    type: 'Medarbetarsamtal',
    agendaContent: `
<div class="space-y-8">
  <div>
    <h1 class="text-3xl font-bold text-foreground mb-4">👋 Välkommen</h1>
    <p class="text-foreground/80 mb-8">Medarbetarsamtalet är ett planerat och strukturerat samtal med syfte att skapa dialog kring arbetssituation, prestation och utveckling. Samtalet ger oss möjlighet att stanna upp, reflektera och gemensamt blicka framåt. Under samtalet har vi en öppen dialog och ett gemensamt ansvar.</p>

    <p><br></p>

    <div class="space-y-8">
      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">🔄 Inledning, tillbakablick och nuläge</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p><strong>1. Hur upplever du din arbetssituation just nu? Vad tar och ger dig energi?</strong></p>
          <p>Anna har bara varit hos oss sedan september 2022 men har kommit in snabbt i rollen. Hon trivs och känner sig välkommen. Det som ger energi är att kunna påverka och bygga nya processer från grunden.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">📋 Arbetsuppgifter och ansvar</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Säkerställa tydlighet, rimlig arbetsbelastning, fokus och förutsättningar.</p>
          <p><strong>2. Vad är viktigt i jobbet för att du ska må bra och prestera?</strong></p>
          <p>Tydlighet kring förväntningar och möjlighet att ta egna initiativ. Anna uppskattar den öppna kulturen och att hon får förtroende att driva saker framåt.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">🤝 Samarbete och arbetsmiljö</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Trivsel och relationer till kollegor.</p>
          <p><strong>3. Hur fungerar samarbetet med dina kollegor? Något som kan fungera bättre?</strong></p>
          <p>Anna har snabbt byggt förtroende med cheferna och visar god förståelse för verksamheten. Samarbetet fungerar bra. Inget specifikt att förbättra just nu.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">📈 Utveckling och lärande</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Motivation, engagemang och långsiktig kompetensutveckling.</p>

          <p><strong>4. Finns det områden i din nuvarande roll där du vill eller behöver utvecklas?</strong></p>
          <p>Anna vill lära sig mer om svensk arbetsrätt och fördjupa sig inom rekrytering av tech-profiler. Hon är ibland för självkritisk och behöver lita mer på sin kompetens.</p>
          <p><span data-task-chip="" data-task-id="task-hist-anna-3" data-title="Gå arbetsrättskurs" data-type="task"></span></p>

          <p><strong>5. Hur vill du utvecklas på kort och lång sikt, finns det roller eller ansvarsområden som du är intresserad av?</strong></p>
          <p>Kort sikt: bygga en skalbar rekryteringsprocess och etablera employer brand. Lång sikt: mer strategiskt HR-arbete.</p>
          <p><span data-task-chip="" data-task-id="goal-hist-anna-3" data-title="Bygga skalbar rekryteringsprocess" data-type="goal"></span></p>
          <p><span data-task-chip="" data-task-id="goal-hist-anna-4" data-title="Etablera employer brand" data-type="goal"></span></p>

          <p><strong>6. Hur kan jag som chef bäst stötta dig i din utveckling och i ditt lärande?</strong></p>
          <p>Ge utrymme att växa och uppmuntra Anna att ta mer plats i möten. Stöd med arbetsrättskurs under Q1.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">🎯 Mål och fokus framåt</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Måluppfyllnad under året, skapa en tydlig riktning och målsättning kommande år.</p>

          <p><strong>7. Hur har uppsatta mål uppnåtts?</strong></p>
          <p>Första samtalet - inga tidigare mål att följa upp. Anna har dock redan identifierat förbättringsområden i rekryteringsprocessen och börjat strukturera intervjuprocessen. Startat employer branding på LinkedIn.</p>

          <p><strong>8. Hur ser kommande mål ut?</strong></p>
          <p>Bygga en skalbar rekryteringsprocess och etablera ett starkt employer brand under 2023.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">💬 Feedback/återkoppling till chef</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Öppen dialog om samarbete med närmsta chef.</p>
          <p><strong>9. Vad i samarbetet/dialogen med din chef tycker du fungerar bra? Finns det något som kan fungera bättre framåt?</strong></p>
          <p>Anna upplever att samarbetet fungerar bra. Hon uppskattar det förtroende hon fått och den öppna kulturen.</p>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-foreground mb-3">✨ Sammanfattning och överenskommelser</h2>
        <div class="pl-0 space-y-3 text-foreground/80">
          <p class="text-muted-foreground">Samsyn om samtalet och kommande period.</p>

          <p><strong>10. Finns det något mer som du vill ta upp och som vi inte har berört under samtalet?</strong></p>
          <p>Anna ser fram emot att växa med företaget. Inget ytterligare att ta upp.</p>

          <p><strong>11. Vilka är de viktigaste insikterna och slutsatserna från dagens samtal?</strong></p>
          <p>Anna har gjort ett starkt intryck under sina första månader. Fokus för 2023 är att bygga skalbar rekryteringsprocess och employer brand. Boka arbetsrättskurs under mars. Uppmuntra Anna att ta mer plats och lita på sin kompetens.</p>
        </div>
      </section>
    </div>
  </div>
</div>`,
    aiSummary: {
      overview: 'Annas första medarbetarsamtal efter att ha jobbat hos oss i cirka 5 månader. Hon har gjort ett starkt intryck och redan identifierat viktiga förbättringsområden. Fokus för 2023 är att bygga en skalbar rekryteringsprocess och etablera vårt employer brand.',
      keyDiscussions: [
        'Stark start - snabbt identifierat förbättringsområden',
        'Initiativ med employer branding på LinkedIn',
        'Behöver lita mer på sin egen kompetens',
        'Vill fördjupa sig inom arbetsrätt och tech-rekrytering'
      ],
      managerNotes: [
        'Anna har stor potential - ge henne utrymme att växa',
        'Uppmuntra henne att ta mer plats i möten',
        'Boka in arbetsrättskurs inom Q1'
      ],
      surveyInsights: [],
      goalsAndTasks: {
        goals: [
          { title: 'Bygga skalbar rekryteringsprocess', status: 'completed', origin: { conversationId: 'hist-anna-2023' } },
          { title: 'Etablera employer brand', status: 'completed', origin: { conversationId: 'hist-anna-2023' } }
        ],
        tasks: [
          { title: 'Gå arbetsrättskurs', status: 'completed', origin: { conversationId: 'hist-anna-2023' } }
        ]
      },
      nextSteps: [
        'Boka arbetsrättskurs under mars',
        'Uppföljning av employer branding-initiativ i maj'
      ]
    },
    comments: [
      {
        id: 'c-hist-anna-2023-1',
        author: annaAndersson,
        text: 'Tack för det fina samtalet Erik! Det känns motiverande att få förtroende att driva rekryteringsprocessen. Jag ska verkligen försöka ta mer plats!',
        timestamp: new Date('2023-02-10T16:00:00')
      }
    ]
  },

  // 5. David Persson History (Lönerevision)
  {
    id: 'hist-david-2024',
    title: 'Lönerevision 2024',
    date: new Date('2024-02-25T14:00:00'),
    participants: [mariaNilsson, davidPersson],
    status: 'completed',
    duration: 45,
    type: 'Lönerevision',
    agendaContent: `<h1>💰 Lönesamtal</h1>
<h2>📊 Prestationsöversikt</h2>
<ul>
  <li>David har varit stabil i backend-teamet.</li>
</ul>
<h2>🎯 Framtida förväntningar</h2>
<ul>
  <li>Cloud-migrering.</li>
  <li><span data-task-chip="" data-task-id="goal-hist-david-1" data-title="Migrera till Cloud" data-type="goal"></span></li>
</ul>
<h2>💰 Löneöversyn</h2>
<p>Löneökning 3.5%.</p>`,
    aiSummary: {
      overview: 'Lönerevision med David Persson. David har varit stabil i backend-teamet under året. Nästa stora fokus är cloud-migrering som David ska leda. Löneökning på 3.5% överenskommen.',
      keyDiscussions: [
        'David har levererat stabilt i backend-teamet under hela året.',
        'Cloud-migrering identifierat som nästa strategiska projekt för David.',
        'Löneökning på 3.5% beslutad baserat på stabil insats.'
      ],
      managerNotes: [
        'David är pålitlig och levererar jämnt - viktig för teamets stabilitet',
        'Cloud-migrering är ett bra utvecklingssteg för David',
        '3.5% löneökning rimlig för stabil prestation'
      ],
      surveyInsights: [],
      goalsAndTasks: {
        goals: [{ title: 'Migrera till Cloud', status: 'completed', origin: { conversationId: 'hist-david-2024' } }],
        tasks: []
      },
      nextSteps: [
        'Sätt upp projektplan för cloud-migrering',
        'Uppföljning av migreringsprogress i Q3'
      ]
    },
    comments: [
      {
        id: 'c-hist-david-1',
        author: davidPersson,
        text: 'Ser fram emot cloud-projektet.',
        timestamp: new Date('2024-02-25T15:00:00')
      }
    ]
  },
]

// ========================================
// Mock Survey Data
// ========================================

export const mockSurveyData: SurveyData = {
  lastUpdated: new Date('2024-11-15'),
  categories: [
    { name: 'Ledarskap', score: 4.2, trend: 'up' },
    { name: 'Arbetsmiljö', score: 3.8, trend: 'stable' },
    { name: 'Utveckling', score: 4.5, trend: 'up' },
    { name: 'Teamkänsla', score: 4.0, trend: 'down' },
  ],
  strengths: ['Tydliga mål', 'Stöttande chef', 'Kompetensutveckling'],
  improvements: ['Stressnivå', 'Möteseffektivitet'],
}

export const mockHistoricalSurveyData: HistoricalSurveyData[] = [
  {
    date: new Date('2024-05-15'),
    score: 4.0,
  },
  {
    date: new Date('2023-11-15'),
    score: 3.9,
  },
  {
    date: new Date('2023-05-15'),
    score: 3.7,
  },
]

export const mockPrivateNotes: PrivateNote[] = [
  {
    id: 'note-1',
    content: 'Kom ihåg att fråga om certifieringen.',
    timestamp: new Date('2025-11-20'),
    author: {
      id: '1',
      name: 'Erik Axelsson',
      role: 'manager',
    },
  },
]
