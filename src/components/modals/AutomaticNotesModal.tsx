/**
 * AutomaticNotesModal Component
 *
 * Multi-step modal for automatic documentation with guided onboarding:
 * 1. Intro - Overview with illustration and two paths
 * 2. Upload/QR - Separate upload experiences
 * 3. Files - Review selected files with option to add more
 * 4. Processing - AI processing state
 * 5. Review - Approve/edit/reject AI-generated blocks
 */

import { useState, useEffect, useRef } from 'react'
import { useStore } from '@/store/useStore'
import {
  X,
  Upload,
  Smartphone,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  FileText,
  Image,
  Trash2,
  Sparkles,
  Edit3,
  CheckCircle2,
  XCircle,
  Target,
  ListTodo,
  Loader2,
  QrCode,
  Plus,
  Wand2,
} from 'lucide-react'
import type { UploadedFile, AIGeneratedBlock } from '@/types'

type ModalStep = 'intro' | 'upload' | 'qr' | 'files' | 'processing' | 'review'

interface AutomaticNotesModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AutomaticNotesModal({ isOpen, onClose }: AutomaticNotesModalProps) {
  const {
    uploadedFiles,
    addFile,
    removeFile,
    aiGeneratedBlocks,
    addAIGeneratedBlocks,
    updateAIBlockStatus,
    updateAIBlockContent,
    removeAIBlock,
    clearAIBlocks,
  } = useStore()

  const [step, setStep] = useState<ModalStep>('intro')
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [qrWaitingTime, setQrWaitingTime] = useState(0)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [addMoreExpanded, setAddMoreExpanded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const qrTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('intro')
      setSelectedFileIds(uploadedFiles.map((f) => f.id))
      setQrWaitingTime(0)
      setProcessingProgress(0)
      setAddMoreExpanded(false)
      clearAIBlocks()
    }
  }, [isOpen])

  // QR code simulation - wait 6 seconds then add mock files
  useEffect(() => {
    if (step === 'qr' && qrWaitingTime < 6) {
      qrTimerRef.current = setTimeout(() => {
        setQrWaitingTime((prev) => prev + 1)
      }, 1000)
    } else if (step === 'qr' && qrWaitingTime >= 6) {
      // Simulate mobile upload - add two mock photos
      const mockFile1: Omit<UploadedFile, 'id' | 'uploadedAt'> = {
        name: 'Anteckningar_sida1.jpg',
        type: 'image/jpeg',
        size: 2400000,
        url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=300&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=100&h=100&fit=crop',
        status: 'uploaded',
        source: 'mobile',
      }
      const mockFile2: Omit<UploadedFile, 'id' | 'uploadedAt'> = {
        name: 'Anteckningar_sida2.jpg',
        type: 'image/jpeg',
        size: 1800000,
        url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=100&h=100&fit=crop',
        status: 'uploaded',
        source: 'mobile',
      }

      addFile(mockFile1)
      addFile(mockFile2)

      // Select the new files and go to files step
      setTimeout(() => {
        const newFiles = useStore.getState().uploadedFiles
        const mobileFiles = newFiles.filter((f) => f.source === 'mobile')
        setSelectedFileIds((prev) => [...new Set([...prev, ...mobileFiles.map((f) => f.id)])])
        setStep('files')
      }, 100)
    }

    return () => {
      if (qrTimerRef.current) {
        clearTimeout(qrTimerRef.current)
      }
    }
  }, [step, qrWaitingTime])

  // Processing simulation - increment progress
  useEffect(() => {
    if (step === 'processing' && processingProgress < 100) {
      const timeout = setTimeout(() => {
        setProcessingProgress((prev) => Math.min(prev + 10, 100))
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [step, processingProgress])

  // Handle processing completion - insert AI blocks into editor and close modal
  useEffect(() => {
    if (step === 'processing' && processingProgress >= 100) {
      insertAIBlocksIntoEditor()
      onClose()
    }
  }, [step, processingProgress])

  const insertAIBlocksIntoEditor = () => {
    const editor = (window as any).__tiptapEditor
    if (!editor || editor.isDestroyed) return

    // AI blocks mapped to specific placeholder positions in the agenda
    // These correspond to the "Lägg till kommentarer här..." placeholders
    const aiBlocksForPlaceholders = [
      {
        // Prestationer & Mål - "Reflektion över senaste perioden:"
        content: `<p>Anna har överträffat sina mål för kvartalet med god marginal. Särskilt positivt är hennes arbete med den nya API-integrationen som levererades två veckor före deadline.</p>`,
        goals: [{ id: 'goal-1', title: 'Bli Senior Developer inom 6 månader', description: 'Fokus på tekniskt ledarskap' }],
        tasks: [],
      },
      {
        // Feedback - "Vad fungerar bra i ditt arbete just nu?"
        content: `<p><em>"Samarbetet i teamet fungerar jättebra. Vi har hittat ett bra flöde med code reviews och daily standups. Jag uppskattar också att jag får ta egna initiativ."</em></p>`,
        goals: [],
        tasks: [],
      },
      {
        // Feedback - "Finns det något du skulle vilja förändra eller förbättra?"
        content: `<p><em>"Ibland känns det stressigt vid release-perioder. Skulle vara bra om vi kunde jämna ut arbetsbelastningen mer."</em></p>`,
        goals: [],
        tasks: [{ id: 'task-1', title: 'Se över sprintplanering för jämnare belastning', assignee: 'Erik Axelsson' }],
      },
      {
        // Utveckling - "Vilka kompetenser vill du utveckla framöver?"
        content: `<p>Anna vill fördjupa sig inom cloud-arkitektur och systemdesign. Hon är särskilt intresserad av AWS och vill ta en certifiering.</p>`,
        goals: [],
        tasks: [{ id: 'task-2', title: 'Boka AWS Solutions Architect-kurs', assignee: 'Anna Andersson' }],
      },
      {
        // Utveckling - "Finns det utbildningar eller kurser som skulle vara värdefulla?"
        content: `<p><em>"Jag skulle vilja gå en kurs i presentationsteknik. Nu när jag ska hålla fler tech talks vill jag bli bättre på att förklara tekniska koncept."</em></p>`,
        goals: [],
        tasks: [{ id: 'task-3', title: 'Anmäla till presentationskurs Q1', assignee: 'Anna Andersson' }],
      },
      {
        // Enkätresultat - "Gå igenom enkätresultaten tillsammans..."
        content: `<p>Enkätresultaten visar generellt positiva siffror. Anna fick höga betyg på samarbete (4.5) och leverans (4.2). Utvecklingsområde: kommunikation i större grupper (3.8).</p>`,
        goals: [],
        tasks: [],
      },
      {
        // Trivsel section
        content: `<p><em>"Jag trivs väldigt bra! Teamet är fantastiskt och jag känner mig uppskattad. Det enda jag saknar är fler sociala aktiviteter utanför jobbet."</em></p>`,
        goals: [],
        tasks: [],
      },
    ]

    // Find all placeholder paragraphs and collect their positions
    const placeholderData: { pos: number; nodeSize: number }[] = []
    const doc = editor.state.doc

    doc.descendants((node: any, pos: number) => {
      if (node.type.name === 'paragraph') {
        // Check if this paragraph contains the placeholder text
        const text = node.textContent
        if (text.includes('Lägg till kommentarer här...')) {
          placeholderData.push({ pos, nodeSize: node.nodeSize })
        }
      }
      return true
    })

    // If no placeholders found, insert at the end as fallback
    if (placeholderData.length === 0) {
      editor.commands.focus('end')
      aiBlocksForPlaceholders.forEach((block, index) => {
        editor.commands.insertContent({
          type: 'aiBlock',
          attrs: {
            blockId: `ai-block-${Date.now()}-${index}`,
            title: '',
            content: block.content,
            goals: block.goals,
            tasks: block.tasks,
            status: 'pending',
          },
        })
      })
      return
    }

    // Replace placeholders from end to start (to preserve positions)
    // This ensures positions don't shift before we use them
    const replacements = placeholderData
      .map((data, index) => ({ ...data, block: aiBlocksForPlaceholders[index] }))
      .filter(r => r.block)
      .reverse()

    // Create a single transaction for all replacements
    const { tr } = editor.state

    replacements.forEach(({ pos, nodeSize, block }, reverseIndex) => {
      const originalIndex = replacements.length - 1 - reverseIndex
      const blockId = `ai-block-${Date.now()}-${originalIndex}`

      // Map the position through previous transaction steps
      const mappedPos = tr.mapping.map(pos)
      const mappedEnd = tr.mapping.map(pos + nodeSize)

      // Create the AI block node
      const aiBlockNode = editor.state.schema.nodes.aiBlock.create({
        blockId,
        title: '',
        content: block.content,
        goals: block.goals,
        tasks: block.tasks,
        status: 'pending',
      })

      // Replace the placeholder paragraph with the AI block
      tr.replaceWith(mappedPos, mappedEnd, aiBlockNode)
    })

    // Apply the transaction
    editor.view.dispatch(tr)
  }

  const generateMockAIBlocks = () => {
    const mockBlocks: Omit<AIGeneratedBlock, 'id'>[] = [
      {
        title: 'Sammanfattning av prestationer',
        content: `<p>Lisa har under året visat en stark utveckling inom försäljning och kundrelationer. Några viktiga punkter som framkom:</p>
<ul>
<li>Överträffat kvartalsmålen med 15%</li>
<li>Byggt upp starka relationer med tre nyckelkunder</li>
<li>Tagit initiativ till att förbättra säljprocessen</li>
</ul>`,
        goals: [
          {
            id: 'goal-1',
            title: 'Öka försäljningen med 20% nästa kvartal',
            description: 'Fokusera på befintliga kunder och merförsäljning',
          },
        ],
        status: 'pending',
        originalSourceFileIds: selectedFileIds,
      },
      {
        title: 'Utvecklingsområden',
        content: `<p>Diskussion om områden för personlig och professionell utveckling:</p>
<ul>
<li>Presentationsteknik för större kundmöten</li>
<li>Fördjupad produktkunskap inom nya tjänster</li>
<li>Ledarskapsutbildning för framtida teamledare</li>
</ul>`,
        tasks: [
          {
            id: 'task-1',
            title: 'Anmäla sig till presentationsutbildning',
            assignee: 'Lisa Eriksson',
          },
          {
            id: 'task-2',
            title: 'Boka möte med produktteamet för genomgång',
            assignee: 'Erik Axelsson',
          },
        ],
        status: 'pending',
        originalSourceFileIds: selectedFileIds,
      },
      {
        title: 'Uppföljning och nästa steg',
        content: `<p>Vi enades om följande uppföljningspunkter:</p>
<ul>
<li>Månadsvis check-in för att följa upp försäljningsmålen</li>
<li>Utvärdering av utbildningsinsatser efter 3 månader</li>
<li>Nästa medarbetarsamtal planeras in om 6 månader</li>
</ul>`,
        status: 'pending',
        originalSourceFileIds: selectedFileIds,
      },
    ]

    addAIGeneratedBlocks(mockBlocks)
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      addFile({
        name: file.name,
        type: file.type,
        size: file.size,
        url,
        thumbnailUrl: file.type.startsWith('image/') ? url : undefined,
        status: 'uploaded',
        source: 'desktop',
      })
    })

    // Select newly added files and go to files step
    setTimeout(() => {
      const newFiles = useStore.getState().uploadedFiles
      setSelectedFileIds(newFiles.map((f) => f.id))
      setStep('files')
    }, 100)
  }

  const handleAddMoreFiles = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      addFile({
        name: file.name,
        type: file.type,
        size: file.size,
        url,
        thumbnailUrl: file.type.startsWith('image/') ? url : undefined,
        status: 'uploaded',
        source: 'desktop',
      })
    })

    // Select newly added files
    setTimeout(() => {
      const newFiles = useStore.getState().uploadedFiles
      setSelectedFileIds(newFiles.map((f) => f.id))
      setAddMoreExpanded(false)
    }, 100)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (step === 'upload') {
      handleFileSelect(e.dataTransfer.files)
    } else if (step === 'files') {
      handleAddMoreFiles(e.dataTransfer.files)
    }
  }

  const toggleFileSelection = (fileId: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleStartProcessing = () => {
    setProcessingProgress(0)
    setStep('processing')
  }

  const handleApproveAll = () => {
    aiGeneratedBlocks.forEach((block) => {
      if (block.status === 'pending') {
        updateAIBlockStatus(block.id, 'approved')
      }
    })
  }

  const handleInsertApproved = () => {
    const approvedBlocks = aiGeneratedBlocks.filter((b) => b.status === 'approved')
    const editor = (window as any).__tiptapEditor

    if (editor && !editor.isDestroyed && approvedBlocks.length > 0) {
      editor.commands.focus('end')

      approvedBlocks.forEach((block, index) => {
        if (index > 0) {
          editor.commands.setHorizontalRule()
        }

        editor.commands.insertContent({
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: block.title }],
        })

        editor.commands.insertContent(block.content)

        if (block.goals && block.goals.length > 0) {
          editor.commands.insertContent({
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Mål:', marks: [{ type: 'bold' }] },
            ],
          })
          block.goals.forEach((goal) => {
            editor.commands.setTaskChip({
              taskId: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: goal.title,
              type: 'goal',
            })
          })
        }

        if (block.tasks && block.tasks.length > 0) {
          editor.commands.insertContent({
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Uppgifter:', marks: [{ type: 'bold' }] },
            ],
          })
          block.tasks.forEach((task) => {
            editor.commands.setTaskChip({
              taskId: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: task.title,
              type: 'task',
            })
          })
        }
      })

      editor.commands.insertContent({
        type: 'paragraph',
        content: [],
      })
    }

    onClose()
  }

  const getHeaderText = () => {
    switch (step) {
      case 'intro':
        return { title: 'Automatisk dokumentering', subtitle: 'Digitalisera dina handskrivna anteckningar' }
      case 'upload':
        return { title: 'Ladda upp filer', subtitle: 'Dra och släpp eller välj filer från din dator' }
      case 'qr':
        return { title: 'Fotografera med telefon', subtitle: 'Skanna QR-koden för att ladda upp' }
      case 'files':
        return { title: 'Valda filer', subtitle: 'Granska och lägg till fler vid behov' }
      case 'processing':
        return { title: 'Bearbetar...', subtitle: 'Vi analyserar dina anteckningar' }
      case 'review':
        return { title: 'Granska förslag', subtitle: 'Godkänn, redigera eller avvisa' }
    }
  }

  if (!isOpen) return null

  const headerText = getHeaderText()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#7e22ce]/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-[#7e22ce]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {headerText.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {headerText.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Intro Step */}
          {step === 'intro' && (
            <IntroStep
              onSelectUpload={() => setStep('upload')}
              onSelectPhone={() => {
                setQrWaitingTime(0)
                setStep('qr')
              }}
            />
          )}

          {/* Upload Step */}
          {step === 'upload' && (
            <UploadStep
              dragOver={dragOver}
              setDragOver={setDragOver}
              onDrop={handleDrop}
              onFileSelect={handleFileSelect}
              fileInputRef={fileInputRef}
            />
          )}

          {/* QR Step */}
          {step === 'qr' && (
            <QRStep waitingTime={qrWaitingTime} />
          )}

          {/* Files Step */}
          {step === 'files' && (
            <FilesStep
              files={uploadedFiles}
              selectedFileIds={selectedFileIds}
              onToggleFile={toggleFileSelection}
              onRemoveFile={(id) => {
                removeFile(id)
                setSelectedFileIds((prev) => prev.filter((fid) => fid !== id))
              }}
              addMoreExpanded={addMoreExpanded}
              setAddMoreExpanded={setAddMoreExpanded}
              dragOver={dragOver}
              setDragOver={setDragOver}
              onDrop={handleDrop}
              onAddMoreFiles={handleAddMoreFiles}
              onStartQR={() => {
                setQrWaitingTime(0)
                setStep('qr')
              }}
            />
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <ProcessingStep progress={processingProgress} />
          )}

          {/* Review Step */}
          {step === 'review' && (
            <ReviewStep
              blocks={aiGeneratedBlocks}
              onApprove={(id) => updateAIBlockStatus(id, 'approved')}
              onReject={(id) => updateAIBlockStatus(id, 'rejected')}
              onEdit={(id, content) => updateAIBlockContent(id, content)}
              onRemove={removeAIBlock}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border flex-shrink-0">
          {step === 'intro' && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Avbryt
              </button>
              <div />
            </>
          )}

          {step === 'upload' && (
            <>
              <button
                onClick={() => setStep('intro')}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Tillbaka
              </button>
              <div />
            </>
          )}

          {step === 'qr' && (
            <>
              <button
                onClick={() => setStep('intro')}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Tillbaka
              </button>
              <div />
            </>
          )}

          {step === 'files' && (
            <>
              <button
                onClick={() => setStep('intro')}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Tillbaka
              </button>
              <button
                onClick={handleStartProcessing}
                disabled={selectedFileIds.length === 0}
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Wand2 className="w-4 h-4" />
                <span>Skapa dokumentering</span>
              </button>
            </>
          )}

          {step === 'processing' && (
            <>
              <button
                onClick={() => {
                  setStep('files')
                  setProcessingProgress(0)
                }}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Avbryt
              </button>
              <div className="text-sm text-muted-foreground">
                Bearbetar...
              </div>
            </>
          )}

          {step === 'review' && (
            <>
              <button
                onClick={() => {
                  setStep('files')
                  clearAIBlocks()
                }}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Tillbaka
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleApproveAll}
                  className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  Godkänn alla
                </button>
                <button
                  onClick={handleInsertApproved}
                  disabled={
                    aiGeneratedBlocks.filter((b) => b.status === 'approved')
                      .length === 0
                  }
                  className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Infoga ({aiGeneratedBlocks.filter((b) => b.status === 'approved').length})
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Intro Step Component
function IntroStep({
  onSelectUpload,
  onSelectPhone,
}: {
  onSelectUpload: () => void
  onSelectPhone: () => void
}) {
  return (
    <div className="space-y-8">
      {/* Illustration */}
      <div className="text-center">
        <img
          src="/wizard-droid.png"
          alt="Wizard Droid"
          className="w-[200px] h-[200px] object-contain mx-auto mb-4"
        />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Förvandla papper till digital text
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Ladda upp foton av dina handskrivna anteckningar så strukturerar vi dem automatiskt enligt samtalsagendan. Du granskar och godkänner innan något sparas.
        </p>
      </div>

      {/* How it works */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">Så här fungerar det</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#7e22ce]/10 text-[#7e22ce] flex items-center justify-center text-xs font-semibold flex-shrink-0">1</div>
            <p className="text-sm text-muted-foreground">Ladda upp bilder av dina anteckningar</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#7e22ce]/10 text-[#7e22ce] flex items-center justify-center text-xs font-semibold flex-shrink-0">2</div>
            <p className="text-sm text-muted-foreground">AI analyserar och strukturerar innehållet</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#7e22ce]/10 text-[#7e22ce] flex items-center justify-center text-xs font-semibold flex-shrink-0">3</div>
            <p className="text-sm text-muted-foreground">Granska och godkänn innan det sparas</p>
          </div>
        </div>
      </div>

      {/* Two options */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground text-center">Hur vill du ladda upp?</p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onSelectUpload}
            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
          >
            <div className="w-14 h-14 rounded-full bg-[#dbeafe] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7 text-[#1d4ed8]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Ladda upp fil</p>
              <p className="text-xs text-muted-foreground mt-1">Från din dator</p>
            </div>
          </button>

          <button
            onClick={onSelectPhone}
            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
          >
            <div className="w-14 h-14 rounded-full bg-[#dcfce7] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Smartphone className="w-7 h-7 text-[#15803d]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Använd telefon</p>
              <p className="text-xs text-muted-foreground mt-1">Fotografera med kameran</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

// Upload Step Component
function UploadStep({
  dragOver,
  setDragOver,
  onDrop,
  onFileSelect,
  fileInputRef,
}: {
  dragOver: boolean
  setDragOver: (v: boolean) => void
  onDrop: (e: React.DragEvent) => void
  onFileSelect: (files: FileList | null) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}) {
  return (
    <div className="space-y-6">
      <div
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
          dragOver
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-border hover:border-muted-foreground/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={(e) => onFileSelect(e.target.files)}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-full bg-[#dbeafe] flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-[#1d4ed8]" />
        </div>
        <p className="text-base font-medium text-foreground mb-2">
          Dra och släpp filer här
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          eller
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Välj filer från din dator
        </button>
        <p className="text-xs text-muted-foreground mt-4">
          Stödjer JPG, PNG och PDF
        </p>
      </div>
    </div>
  )
}

// QR Step Component
function QRStep({ waitingTime }: { waitingTime: number }) {
  const progress = Math.min((waitingTime / 6) * 100, 100)
  const remainingSeconds = Math.max(6 - waitingTime, 0)

  return (
    <div className="text-center space-y-6 py-4">
      {/* QR Code with animation */}
      <div className="relative inline-block">
        <div className="w-56 h-56 bg-foreground rounded-2xl p-4 mx-auto relative overflow-hidden shadow-lg">
          <div className="w-full h-full bg-background rounded-lg relative">
            <QrCode className="w-full h-full text-foreground p-3" />
            {/* Scanning line animation */}
            <div
              className="absolute left-2 right-2 h-1 bg-primary/60 rounded-full"
              style={{
                animation: 'scan 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        {/* Progress ring */}
        <svg
          className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)]"
          viewBox="0 0 232 232"
        >
          <circle
            cx="116"
            cy="116"
            r="110"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-muted"
          />
          <circle
            cx="116"
            cy="116"
            r="110"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-primary"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 110}
            strokeDashoffset={2 * Math.PI * 110 * (1 - progress / 100)}
            transform="rotate(-90 116 116)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h4 className="text-base font-semibold text-foreground">
          Skanna med din telefon
        </h4>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Öppna kameran på din telefon och skanna QR-koden. Du kan sedan ta foton av dina anteckningar.
        </p>
      </div>

      {/* Waiting indicator */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 max-w-xs mx-auto">
        <div className="flex items-center justify-center gap-2 text-sm text-primary">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="font-medium">Väntar på uppladdning...</span>
        </div>
        {remainingSeconds > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Demo: {remainingSeconds}s kvar
          </p>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 8px; }
          50% { top: calc(100% - 12px); }
        }
      `}</style>
    </div>
  )
}

// Files Step Component
function FilesStep({
  files,
  selectedFileIds,
  onToggleFile,
  onRemoveFile,
  addMoreExpanded,
  setAddMoreExpanded,
  dragOver,
  setDragOver,
  onDrop,
  onAddMoreFiles,
  onStartQR,
}: {
  files: UploadedFile[]
  selectedFileIds: string[]
  onToggleFile: (id: string) => void
  onRemoveFile: (id: string) => void
  addMoreExpanded: boolean
  setAddMoreExpanded: (v: boolean) => void
  dragOver: boolean
  setDragOver: (v: boolean) => void
  onDrop: (e: React.DragEvent) => void
  onAddMoreFiles: (files: FileList | null) => void
  onStartQR: () => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-6">
      {/* Selected files info */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-foreground">
            {selectedFileIds.length} av {files.length} filer valda
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Avmarkera filer du inte vill inkludera
          </p>
        </div>
        <button
          onClick={() => {
            if (selectedFileIds.length === files.length) {
              files.forEach(f => onToggleFile(f.id))
            } else {
              files.forEach(f => {
                if (!selectedFileIds.includes(f.id)) {
                  onToggleFile(f.id)
                }
              })
            }
          }}
          className="text-xs text-primary hover:underline font-medium"
        >
          {selectedFileIds.length === files.length ? 'Avmarkera alla' : 'Markera alla'}
        </button>
      </div>

      {/* File list */}
      <div className="space-y-2">
        {files.map((file) => (
          <FileSelectionItem
            key={file.id}
            file={file}
            selected={selectedFileIds.includes(file.id)}
            onToggle={() => onToggleFile(file.id)}
            onRemove={() => onRemoveFile(file.id)}
          />
        ))}
      </div>

      {/* Add more section */}
      <div className="border border-border rounded-lg overflow-hidden">
        <button
          onClick={() => setAddMoreExpanded(!addMoreExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Lägg till fler filer</span>
          </div>
          {addMoreExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {addMoreExpanded && (
          <div className="p-4 pt-0 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={(e) => onAddMoreFiles(e.target.files)}
              className="hidden"
            />

            {/* Drag and drop area */}
            <div
              onDrop={onDrop}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-border'
              }`}
            >
              <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Dra och släpp filer här
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-muted text-foreground rounded-md text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                Välj filer
              </button>
            </div>

            {/* Or use phone */}
            <button
              onClick={onStartQR}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-[#dcfce7] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-[#15803d]" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Använd telefon</p>
                <p className="text-xs text-muted-foreground">Fotografera med kameran</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
            </button>
          </div>
        )}
      </div>

      {/* Info text */}
      <div className="bg-muted/30 rounded-lg p-3">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Information:</strong> De valda filerna skickas till AI för bearbetning. Du granskar och godkänner innan något sparas i samtalet.
        </p>
      </div>
    </div>
  )
}

// File Selection Item Component
function FileSelectionItem({
  file,
  selected,
  onToggle,
  onRemove,
}: {
  file: UploadedFile
  selected: boolean
  onToggle: () => void
  onRemove: () => void
}) {
  const Icon = file.type.startsWith('image/') ? Image : FileText

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div
      onClick={onToggle}
      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
        selected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:bg-muted/50'
      }`}
    >
      {/* Checkbox */}
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
          selected
            ? 'bg-primary border-primary'
            : 'border-muted-foreground/50'
        }`}
      >
        {selected && <Check className="w-3 h-3 text-primary-foreground" />}
      </div>

      {/* Thumbnail or icon */}
      {file.thumbnailUrl ? (
        <div
          className="w-10 h-10 rounded-md bg-cover bg-center flex-shrink-0"
          style={{ backgroundImage: `url(${file.thumbnailUrl})` }}
        />
      ) : (
        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
      )}

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {file.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)} · {file.source === 'mobile' ? 'Via telefon' : 'Desktop'}
        </p>
      </div>

      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors flex-shrink-0"
        title="Ta bort"
      >
        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
      </button>
    </div>
  )
}

// Processing Step Component
function ProcessingStep({ progress }: { progress: number }) {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="relative inline-block">
        <div className="w-28 h-28 mx-auto">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-muted"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-primary"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary animate-pulse" />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-foreground mb-2">
          Skapar dokumentering...
        </h4>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Vi analyserar dina anteckningar och strukturerar dem enligt samtalsagendan.
        </p>
      </div>

      <div className="max-w-xs mx-auto">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">{progress}%</p>
      </div>
    </div>
  )
}

// Review Step Component
function ReviewStep({
  blocks,
  onApprove,
  onReject,
  onEdit,
  onRemove,
}: {
  blocks: AIGeneratedBlock[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onEdit: (id: string, content: string) => void
  onRemove: (id: string) => void
}) {
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  const handleStartEdit = (block: AIGeneratedBlock) => {
    setEditingBlockId(block.id)
    setEditContent(block.content)
  }

  const handleSaveEdit = (id: string) => {
    onEdit(id, editContent)
    setEditingBlockId(null)
    setEditContent('')
  }

  const approvedCount = blocks.filter((b) => b.status === 'approved').length
  const rejectedCount = blocks.filter((b) => b.status === 'rejected').length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">
          {blocks.length} förslag genererade
        </h4>
        <div className="flex items-center gap-3 text-xs">
          {approvedCount > 0 && (
            <span className="flex items-center gap-1 text-[#15803d]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {approvedCount} godkända
            </span>
          )}
          {rejectedCount > 0 && (
            <span className="flex items-center gap-1 text-destructive">
              <XCircle className="w-3.5 h-3.5" />
              {rejectedCount} avvisade
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {blocks.map((block) => (
          <AIBlockCard
            key={block.id}
            block={block}
            isEditing={editingBlockId === block.id}
            editContent={editContent}
            onEditContentChange={setEditContent}
            onApprove={() => onApprove(block.id)}
            onReject={() => onReject(block.id)}
            onStartEdit={() => handleStartEdit(block)}
            onSaveEdit={() => handleSaveEdit(block.id)}
            onCancelEdit={() => setEditingBlockId(null)}
            onRemove={() => onRemove(block.id)}
          />
        ))}
      </div>
    </div>
  )
}

// AI Block Card Component
function AIBlockCard({
  block,
  isEditing,
  editContent,
  onEditContentChange,
  onApprove,
  onReject,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onRemove,
}: {
  block: AIGeneratedBlock
  isEditing: boolean
  editContent: string
  onEditContentChange: (content: string) => void
  onApprove: () => void
  onReject: () => void
  onStartEdit: () => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onRemove: () => void
}) {
  const getStatusStyles = () => {
    switch (block.status) {
      case 'approved':
        return 'border-[#15803d]/30 bg-[#dcfce7]/30'
      case 'rejected':
        return 'border-destructive/30 bg-destructive/5 opacity-60'
      default:
        return 'border-border'
    }
  }

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${getStatusStyles()}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#7e22ce]/10 rounded-md">
            <Sparkles className="w-4 h-4 text-[#7e22ce]" />
          </div>
          <h5 className="text-sm font-semibold text-foreground">
            {block.title}
          </h5>
          {block.status === 'approved' && (
            <span className="text-xs bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full font-medium">
              Godkänd
            </span>
          )}
          {block.status === 'rejected' && (
            <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-medium">
              Avvisad
            </span>
          )}
        </div>
        <button
          onClick={onRemove}
          className="p-1 hover:bg-muted rounded transition-colors"
          title="Ta bort"
        >
          <Trash2 className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => onEditContentChange(e.target.value)}
            className="w-full h-32 p-3 text-sm bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#7e22ce]/50"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={onSaveEdit}
              className="px-3 py-1.5 bg-[#7e22ce] text-white rounded-md text-xs font-medium hover:bg-[#7e22ce]/90 transition-colors"
            >
              Spara
            </button>
            <button
              onClick={onCancelEdit}
              className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Avbryt
            </button>
          </div>
        </div>
      ) : (
        <div
          className="prose prose-sm text-sm text-muted-foreground mb-4 max-w-none"
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      )}

      {/* Goals */}
      {block.goals && block.goals.length > 0 && !isEditing && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-2">
            <Target className="w-3.5 h-3.5 text-[#c2410c]" />
            <span>Mål</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {block.goals.map((goal) => (
              <span
                key={goal.id}
                className="text-xs bg-[#ffedd5] text-[#c2410c] px-2 py-1 rounded"
              >
                {goal.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tasks */}
      {block.tasks && block.tasks.length > 0 && !isEditing && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-2">
            <ListTodo className="w-3.5 h-3.5 text-[#1d4ed8]" />
            <span>Uppgifter</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {block.tasks.map((task) => (
              <span
                key={task.id}
                className="text-xs bg-[#dbeafe] text-[#1d4ed8] px-2 py-1 rounded"
              >
                {task.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {block.status === 'pending' && !isEditing && (
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <button
            onClick={onApprove}
            className="flex-1 px-3 py-2 bg-[#7e22ce] text-white rounded-md text-xs font-medium hover:bg-[#7e22ce]/90 transition-colors flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Godkänn
          </button>
          <button
            onClick={onStartEdit}
            className="px-3 py-2 border border-border rounded-md text-xs font-medium hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Redigera
          </button>
          <button
            onClick={onReject}
            className="px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors flex items-center justify-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            Avvisa
          </button>
        </div>
      )}

      {/* Revert actions for approved/rejected */}
      {(block.status === 'approved' || block.status === 'rejected') &&
        !isEditing && (
          <div className="flex items-center gap-2 pt-3 border-t border-border">
            <button
              onClick={onStartEdit}
              className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Redigera
            </button>
            <button
              onClick={block.status === 'approved' ? onReject : onApprove}
              className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {block.status === 'approved' ? 'Avvisa istället' : 'Godkänn istället'}
            </button>
          </div>
        )}
    </div>
  )
}
