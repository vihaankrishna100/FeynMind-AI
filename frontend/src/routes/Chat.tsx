import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { feynmanChat, saveMinutes, generateQuiz } from '../lib/api'
import MicButton from '../components/MicButton'

export default function Chat() {
  const { 
    topic, 
    difficulty,
    transcript, 
    chatHistory, 
    micTimer,
    setTranscript,
    addChatMessage,
    clearChatHistory,
    startMicTimer,
    stopMicTimer,
    resetMicTimer
  } = useAppStore()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [followups, setFollowups] = useState<string[]>([])
  const [suggestQuiz, setSuggestQuiz] = useState(false)

  const handleAnalyze = async () => {
    if (!topic.trim() || !transcript.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await feynmanChat({
        topic: topic.trim(),
        transcript: transcript.trim(),
        history: chatHistory
      })
      
      addChatMessage({ role: 'user', content: transcript })
      addChatMessage({ role: 'assistant', content: response.response })
      
      setFollowups(response.followups)
      setSuggestQuiz(response.suggest_quiz)
      setTranscript('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze')
    } finally {
      setLoading(false)
    }
  }

  const handleFollowup = (followup: string) => {
    setTranscript(followup)
    setFollowups([])
  }

  const handleSaveMinutes = async () => {
    const totalMinutes = Math.round(micTimer.totalMs / 60000)
    if (totalMinutes > 0) {
      try {
        await saveMinutes({
          topic: topic.trim(),
          minutes: totalMinutes
        })
        resetMicTimer()
        alert(`Saved ${totalMinutes} minutes!`)
      } catch (err) {
        alert('Failed to save minutes')
      }
    }
  }

  const handleGenerateQuiz = async () => {
    try {
      await generateQuiz({ topic: topic.trim(), difficulty })
      window.location.href = '/quiz'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz')
    }
  }

  const totalMinutes = Math.round(micTimer.totalMs / 60000)

  return (
    <div className="card">
      <h2>Feynman Chat</h2>
      
      {!topic.trim() ? (
        <p>Please enter a topic on the home page to start chatting.</p>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            <strong>Topic:</strong> {topic}
          </div>

          {chatHistory.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3>Conversation</h3>
                <button className="btn btn-secondary" onClick={clearChatHistory}>
                  Clear History
                </button>
              </div>
              
              {chatHistory.map((message: any, index: number) => (
                <div key={index} className={`chat-message ${message.role}`}>
                  <strong>{message.role === 'user' ? 'You' : 'Tutor'}:</strong>
                  <p style={{ marginTop: '8px' }}>{message.content}</p>
                </div>
              ))}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Explain your understanding of "{topic}":</label>
            <textarea
              className="form-input"
              value={transcript}
              onChange={(e: any) => setTranscript(e.target.value)}
              placeholder="Describe what you know about this topic..."
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
            <MicButton 
              onTranscriptUpdate={setTranscript}
              onStart={startMicTimer}
              onStop={stopMicTimer}
            />
            
            <button 
              className="btn" 
              onClick={handleAnalyze}
              disabled={!transcript.trim() || loading}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>

          {error && (
            <div className="error">{error}</div>
          )}

          {followups.length > 0 && (
            <div className="followups">
              <h4>Follow-up questions:</h4>
              {followups.map((followup: string, index: number) => (
                <button
                  key={index}
                  className="followup-btn"
                  onClick={() => handleFollowup(followup)}
                >
                  {followup}
                </button>
              ))}
            </div>
          )}

          {suggestQuiz && (
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#d4edda', borderRadius: '6px' }}>
              <p style={{ marginBottom: '12px' }}>Great! You seem ready for a quiz.</p>
              <button className="btn btn-success" onClick={handleGenerateQuiz}>
                Generate Quiz
              </button>
            </div>
          )}

          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Listening Time:</strong> {totalMinutes} minutes
              </div>
              <button 
                className="btn btn-secondary" 
                onClick={handleSaveMinutes}
                disabled={totalMinutes === 0}
              >
                Save Minutes
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
