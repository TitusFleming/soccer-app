import { useState } from 'react'
import { Icons } from './Icons'

interface ChatInputProps {
  onSubmit: (message: string) => Promise<void>
  disabled?: boolean
  placeholder?: string
}

export default function ChatInput({ onSubmit, disabled, placeholder }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || disabled) return

    setInput('')
    await onSubmit(input)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background to-background/30 py-4">
      <form 
        onSubmit={handleSubmit} 
        className="max-w-3xl mx-auto px-4 flex gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder || "Ask about a player (e.g., 'How many goals does Cole Palmer score?')"}
          className="flex-1 rounded-lg border bg-background px-4 py-2.5 text-foreground shadow-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icons.send className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
} 