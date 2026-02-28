import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { generateQuiz } from '../lib/api'

export default function Home() {
  const { topic, difficulty, setTopic, setDifficulty, lastQuiz } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      await generateQuiz({ topic: topic.trim(), difficulty })
      navigate('/quiz')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz')
    } finally {
      setLoading(false)
    }
  }

  const handleFeynmanChat = () => {
    navigate('/chat')
  }

  const handleRedoQuiz = () => {
    if (lastQuiz) {
      navigate('/quiz')
    }
  }

  return (
    <div className="card">
      <h1 style={{ textAlign: 'center', marginBottom: '32px', color: '#333' }}>
        Welcome to FeynMind AI
      </h1>
      
      <p style={{ textAlign: 'center', marginBottom: '32px', fontSize: '18px', color: '#666' }}>
        Learn any topic through interactive quizzes and Socratic tutoring
      </p>

      <div className="form-group">
        <label className="form-label">What would you like to learn about?</label>
        <input
          type="text"
          className="form-input"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., Photosynthesis, World War II, Machine Learning)"
          maxLength={120}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Quiz difficulty</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn ${difficulty === 'easy' ? '' : 'btn-secondary'}`}
            onClick={() => setDifficulty('easy')}
          >
            Easy
          </button>
          <button
            type="button"
            className={`btn ${difficulty === 'medium' ? '' : 'btn-secondary'}`}
            onClick={() => setDifficulty('medium')}
          >
            Medium
          </button>
          <button
            type="button"
            className={`btn ${difficulty === 'hard' ? '' : 'btn-secondary'}`}
            onClick={() => setDifficulty('hard')}
          >
            Hard
          </button>
        </div>
      </div>

      {error && (
        <div className="error">{error}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
        <button
          className="btn"
          onClick={handleGenerateQuiz}
          disabled={!topic.trim() || loading}
        >
          {loading ? 'Generating...' : 'Generate AI Quiz'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleFeynmanChat}
          disabled={!topic.trim()}
        >
          Feynman Chat
        </button>

        <button
          className="btn btn-success"
          onClick={handleRedoQuiz}
          disabled={!lastQuiz}
        >
          Redo Quiz
        </button>
      </div>



      <div style={{ marginTop: '32px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        
        <h3 style={{ marginBottom: '16px' }}>How it works:</h3>
        
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>
            <strong>Generate AI Quiz:</strong> Create a multiple-choice quiz with explanations
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Feynman Chat:</strong> Explain your understanding and get Socratic guidance
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Redo Quiz:</strong> Generate a new quiz for the same topic
          </li>
          <li>
            <strong>Progress:</strong> Track your quiz accuracy and listening time
          
          </li>
        </ul>
      
      </div>
    </div>
  )
}
