import { useEffect, useRef } from 'react'
import type { Message } from '@/types/chat'
import MessageItem from './MessageItem'
import LoadingDots from './LoadingDots'

interface MessageListProps {
  messages: Message[]
  loading?: boolean
}

export default function MessageList({ messages, loading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-center">
        Welcome! I provide detailed statistics for players in Europe&apos;s top 5 leagues, with data last updated December 2024.
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, index) => (
        <MessageItem key={index} {...message} />
      ))}
      {loading && (
        <div className="py-8 bg-secondary">
          <div className="max-w-3xl mx-auto px-4 flex gap-6">
            <div className="mt-1 w-8 h-8 flex-shrink-0">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <LoadingDots />
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
} 