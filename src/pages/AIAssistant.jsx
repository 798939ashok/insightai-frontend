import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, BarChart3, Trash2 } from 'lucide-react'
import ReactECharts from 'echarts-for-react'
import api from '../services/api'

const suggestedQuestions = [
  "What is today's revenue?",
  'Which product has highest sales?',
  'Show monthly sales trend.',
  'Compare product categories.',
  'Find low selling products.',
  'Generate business recommendations.',
]

const CHAT_STORAGE_KEY = 'insightai_chat_history'

function loadSavedMessages() {
  try {
    const saved = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || 'null')
    if (Array.isArray(saved) && saved.length > 0) return saved
  } catch {
    // fall through to default
  }
  return [{ role: 'assistant', text: "Hi! Ask me anything about your uploaded data — I'll only answer using what's actually there.", chart: null }]
}

export default function AIAssistant() {
  const [messages, setMessages] = useState(loadSavedMessages)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  const sendMessage = async (text) => {
    if (!text.trim()) return
    setMessages((prev) => [...prev, { role: 'user', text }])
    setInput('')
    setTyping(true)

    try {
      // Backend grounds the answer in uploaded CSV/Excel or connected MySQL data only.
      // If a chart is relevant, it returns structured ECharts option alongside the text.
      const { data } = await api.post('/api/assistant/query', { question: text })
      setMessages((prev) => [...prev, { role: 'assistant', text: data.answer, chart: data.chart_option || null }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'I could not reach the data service. Please check your upload or internet connection and try again.', chart: null },
      ])
    } finally {
      setTyping(false)
    }
  }

  const clearChat = () => {
    const fresh = [{ role: 'assistant', text: "Hi! Ask me anything about your uploaded data — I'll only answer using what's actually there.", chart: null }]
    setMessages(fresh)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      <div className="flex justify-end mb-2">
        <button onClick={clearChat} className="flex items-center gap-1 text-xs text-ink-500 hover:text-accent-rose transition-colors">
          <Trash2 size={13} /> Clear chat
        </button>
      </div>
      {/* Message history */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin space-y-4 pr-1 pb-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${m.role === 'user' ? 'order-2' : ''}`}>
              {m.role === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-1 text-xs text-ink-500">
                  <Sparkles size={12} className="text-brand" /> InsightAI
                </div>
              )}
              <div className={`rounded-card px-4 py-2.5 text-sm leading-relaxed ${
                m.role === 'user' ? 'bg-brand text-white' : 'bg-surface border border-ink-100 text-ink-900'
              }`}>
                {m.text}
              </div>
              {m.chart && (
                <div className="mt-2 bg-surface border border-ink-100 rounded-card p-3">
                  <ReactECharts option={m.chart} style={{ height: 200 }} opts={{ renderer: 'svg' }} />
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-1.5 text-ink-500 text-sm">
            <BarChart3 size={14} className="text-brand" />
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-ink-300 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-ink-300 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-ink-300 animate-bounce" />
            </span>
          </div>
        )}
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="text-xs font-medium text-ink-700 bg-ink-100 hover:bg-brand-light hover:text-brand-dark px-3 py-1.5 rounded-full transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
        className="flex items-center gap-2 bg-surface border border-ink-300 rounded-card p-1.5 shadow-card focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your data..."
          className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || typing}
          className="p-2 rounded-lg bg-brand text-white hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Send"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}