import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { GoogleGenerativeAI } from '@google/generative-ai'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your resume building assistant. How can I help you today?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      // Check if API key is available
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('API key not configured')
      }

      // Initialize Gemini API
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })

      // Create context-aware prompt
      const prompt = `You are a helpful assistant for a resume builder application. 
      The user is asking: "${userMessage}"
      
      Please provide a concise, helpful response related to resume building, job applications, or career advice. 
      Keep your response under 150 words.`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Add assistant response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: text }])
    } catch (error) {
      console.error('Error calling Gemini API:', error)
      let errorMessage = 'Sorry, I encountered an error. '
      
      if (error.message === 'API key not configured') {
        errorMessage += 'Please add your Gemini API key to the .env file as VITE_GEMINI_API_KEY'
      } else if (error.message?.includes('API_KEY_INVALID')) {
        errorMessage += 'Your API key appears to be invalid. Please check your Gemini API key.'
      } else if (error.message?.includes('quota')) {
        errorMessage += 'API quota exceeded. Please check your Gemini API usage.'
      } else {
        errorMessage += `Error: ${error.message || 'Unknown error'}. Please try again.`
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Icon Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
          aria-label="Open chat"
        >
          <MessageCircle className="size-6" />
        </button>
      )}

      {/* Chat Dialog */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-200 max-sm:w-[calc(100vw-3rem)] max-sm:h-[500px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <MessageCircle className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold">Resume Assistant</h3>
                <p className="text-xs text-purple-100">Ask me anything!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100" style={{ scrollbarWidth: 'thin' }}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                  <Loader2 className="size-5 animate-spin text-purple-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about resumes..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors"
                aria-label="Send message"
              >
                <Send className="size-5" />
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Custom Scrollbar Styles */}
      <style>{`
        /* Custom scrollbar for webkit browsers */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d8b4fe;
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #c084fc;
        }
      `}</style>
    </>
  )
}

export default ChatBot
