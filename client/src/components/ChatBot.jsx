import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { GoogleGenerativeAI } from '@google/generative-ai'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your resume building assistant. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => scrollToBottom(), [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey || apiKey === 'your_gemini_api_key_here') throw new Error('API key not configured')

      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
      const prompt = `You are a helpful assistant for a resume builder application. The user is asking: "${userMessage}" Please provide a concise, helpful response related to resume building, job applications, or career advice. Keep your response under 150 words.`
      const result = await model.generateContent(prompt)
      const response = await result.response
      setMessages(prev => [...prev, { role: 'assistant', content: response.text() }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I encountered an error: ${error.message}` }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-3.5 rounded-full shadow-lg transition-all hover:scale-110 z-50"
          style={{ background: 'var(--gradient-accent)', color: '#fff' }}>
          <MessageCircle size={22} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] z-50 rounded-2xl overflow-hidden border flex flex-col"
          style={{ height: '500px', maxHeight: 'calc(100vh-3rem)', background: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-xl)' }}>
          {/* Header */}
          <div className="p-4 flex items-center justify-between shrink-0" style={{ background: 'var(--gradient-accent)' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <MessageCircle size={16} color="#fff" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Resume Assistant</h3>
                <p className="text-[11px] text-white/60">Ask me anything!</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-full transition-colors hover:bg-white/20">
              <X size={16} color="#fff" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: 'var(--bg-tertiary)' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3.5 py-2 rounded-xl text-sm ${msg.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                  style={{
                    background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-card)',
                    color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                    border: msg.role === 'user' ? 'none' : `1px solid var(--border-primary)`,
                  }}>
                  <p className="whitespace-pre-wrap text-[13px]">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-3.5 py-2 rounded-xl rounded-bl-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                  <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent-light)' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 border-t shrink-0" style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-card)' }}>
            <div className="flex gap-2">
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder="Ask about resumes..." disabled={isLoading}
                className="flex-1 px-3.5 py-2 rounded-full text-sm"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }} />
              <button type="submit" disabled={isLoading || !input.trim()}
                className="p-2 rounded-full transition-colors disabled:opacity-40"
                style={{ background: 'var(--gradient-accent)', color: '#fff' }}>
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default ChatBot
