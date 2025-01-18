'use client'

import { useState } from 'react'
import type { Message } from '@/types/chat'
import MessageList from './MessageList'
import ChatInput from './ChatInput'

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (question: string) => {
    setLoading(true)
    setMessages(prev => [...prev, { role: 'user', content: question }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request.' 
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-lg">⚽</span>
          </div>
          <h1 className="font-semibold text-lg text-foreground">Soccer Stats Chat</h1>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <MessageList messages={messages} loading={loading} />
        <div className="h-36" /> {/* Spacer for input */}
        <ChatInput 
          onSubmit={handleSubmit}
          disabled={loading}
          placeholder="Ask about a player (e.g., 'How many goals does Cole Palmer score?')"
        />
      </main>
    </div>
  )
}
