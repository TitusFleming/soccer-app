import { useState } from 'react'
import { Icons } from './Icons'

interface MessageItemProps {
  role: 'user' | 'assistant'
  content: string
}

export default function MessageItem({ role, content }: MessageItemProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`py-8 ${role === 'assistant' ? 'bg-secondary' : ''} group`}>
      <div className="max-w-3xl mx-auto px-4 flex gap-6">
        <div className="mt-1 w-8 h-8 flex-shrink-0">
          {role === 'user' ? (
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icons.user className="w-5 h-5 text-primary-foreground" />
            </div>
          ) : (
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Icons.bot className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-foreground">{content}</p>
        </div>
        {role === 'assistant' && (
          <button
            onClick={copyToClipboard}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Copy message"
          >
            {copied ? (
              <Icons.check className="w-4 h-4 text-green-500" />
            ) : (
              <Icons.copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            )}
          </button>
        )}
      </div>
    </div>
  )
} 