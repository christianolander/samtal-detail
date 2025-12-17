/**
 * FilesTab Component
 *
 * Tab for managing uploaded files related to the conversation.
 * Supports file upload, preview, and deletion.
 */

import { useRef, useState } from 'react'
import { useStore } from '@/store/useStore'
import {
  FileText,
  Image,
  Upload,
  Trash2,
  Download,
  Eye,
  Plus,
  Smartphone,
} from 'lucide-react'
import type { UploadedFile } from '@/types'

export default function FilesTab() {
  const { uploadedFiles, addFile, removeFile, openAutomaticNotesModal } = useStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

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
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image
    return FileText
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-foreground">Filer</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Ladda upp underlag och anteckningar från mötet
        </p>
      </div>

      {/* Upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-muted-foreground/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground mb-3">
          Dra och släpp filer här
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-muted text-foreground rounded-md text-sm font-medium hover:bg-muted/80 transition-colors"
        >
          Välj filer
        </button>
      </div>

      {/* Mobile upload option */}
      <button
        onClick={openAutomaticNotesModal}
        className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#dbeafe] flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-[#1d4ed8]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground">
            Ladda upp via telefon
          </div>
          <div className="text-xs text-muted-foreground">
            Skanna en QR-kod och ta foto av dina anteckningar
          </div>
        </div>
      </button>

      {/* Automatic notes CTA */}
      {uploadedFiles.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground mb-1">
                Automatiska anteckningar
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Vill du automatiskt strukturera anteckningarna efter agendan?
              </p>
              <button
                onClick={openAutomaticNotesModal}
                className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                Skapa automatisk dokumentering
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File list */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Uppladdade filer ({uploadedFiles.length})
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <FileItem key={file.id} file={file} onRemove={removeFile} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {uploadedFiles.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Inga filer uppladdade ännu
          </p>
        </div>
      )}
    </div>
  )
}

function FileItem({
  file,
  onRemove,
}: {
  file: UploadedFile
  onRemove: (id: string) => void
}) {
  const [showPreview, setShowPreview] = useState(false)
  const Icon = file.type.startsWith('image/') ? Image : FileText

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <>
      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg group">
        {/* Thumbnail or icon */}
        {file.thumbnailUrl ? (
          <div
            className="w-10 h-10 rounded-md bg-cover bg-center flex-shrink-0 cursor-pointer"
            style={{ backgroundImage: `url(${file.thumbnailUrl})` }}
            onClick={() => setShowPreview(true)}
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
            {formatFileSize(file.size)} &middot;{' '}
            {file.source === 'mobile' ? 'Via telefon' : 'Desktop'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {file.thumbnailUrl && (
            <button
              onClick={() => setShowPreview(true)}
              className="p-1.5 hover:bg-muted rounded-md transition-colors"
              title="Förhandsgranska"
            >
              <Eye className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <button
            onClick={() => {
              const link = document.createElement('a')
              link.href = file.url
              link.download = file.name
              link.click()
            }}
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
            title="Ladda ner"
          >
            <Download className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => onRemove(file.id)}
            className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors"
            title="Ta bort"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>
      </div>

      {/* Image preview modal */}
      {showPreview && file.thumbnailUrl && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-in fade-in duration-200"
          onClick={() => setShowPreview(false)}
        >
          <div className="max-w-4xl max-h-[90vh] p-4">
            <img
              src={file.url}
              alt={file.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  )
}
