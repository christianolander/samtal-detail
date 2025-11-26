import type { Comment } from '@/types'

interface CommentItemProps {
  comment: Comment
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="p-4 bg-muted rounded-lg">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
          {comment.author.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">
              {comment.author.title}
            </span>
            <span className="text-xs text-muted-foreground">
              •
            </span>
            <span className="text-xs text-muted-foreground">
              {comment.timestamp.toLocaleString('sv-SE')}
            </span>
          </div>
          <p className="text-sm">{comment.text}</p>
          {comment.tags && comment.tags.length > 0 && (
            <div className="flex gap-1 mt-2">
              {comment.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-background rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
