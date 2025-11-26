/**
 * CommentsSection Component
 *
 * Collapsible full-width section for comments
 * Counter badge animates when new comment added
 * State-dependent visibility based on conversation status
 */

import { useStore } from '@/store/useStore'
import CommentComposer from './CommentComposer'
import CommentItem from './CommentItem'

export default function CommentsSection() {
  const { currentSamtal, commentsCollapsed, toggleComments } = useStore()
  const comments = currentSamtal.comments || []

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header with counter and toggle */}
      <button
        onClick={toggleComments}
        className="w-full flex items-center justify-between mb-4 group"
        aria-expanded={!commentsCollapsed}
        aria-controls="comments-content"
        data-testid="comments-toggle"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg text-foreground">Kommentarer</h3>
          {comments.length > 0 && (
            <span
              className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium transition-transform duration-200 group-hover:scale-110"
              key={comments.length} // Key forces re-render for animation
            >
              {comments.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            {commentsCollapsed ? 'Visa' : 'Dölj'}
          </span>
          <svg
            className={`w-5 h-5 text-muted-foreground group-hover:text-foreground transition-all duration-200 ${
              commentsCollapsed ? '' : 'rotate-180'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Content */}
      {!commentsCollapsed && (
        <div id="comments-content" className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <CommentComposer />

          {comments.length > 0 ? (
            <div className="space-y-3 pt-4">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-border rounded-lg">
              <p className="text-sm text-muted-foreground">
                Inga kommentarer ännu. Använd kommentarsfältet för att dela
                anteckningar mellan samtalen.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
