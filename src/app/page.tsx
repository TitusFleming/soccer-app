import ChatInterface from '@/components/chatinterface'

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        Soccer Player Stats Chat
      </h1>
      <ChatInterface />
    </div>
  )
}
