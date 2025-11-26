import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { erikAxelsson } from '@/lib/mockData'

export default function CommentComposer() {
  const { addComment } = useStore()
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      addComment({
        text: text.trim(),
        author: erikAxelsson,
      })
      setText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Lägg till en kommentar..."
        className="w-full p-3 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        rows={3}
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lägg till kommentar
        </button>
      </div>
    </form>
  )
}
