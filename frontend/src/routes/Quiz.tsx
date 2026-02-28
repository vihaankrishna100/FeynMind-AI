import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { generateQuiz, saveAttempt } from '../lib/api'
import QuizCard from '../components/QuizCard'

export default function Quiz() {
  const { topic, difficulty, lastQuiz, setLastQuiz } = useAppStore()
  const [quiz, setQuiz] = useState(lastQuiz)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {

    if (!quiz && topic) {
      loadQuiz()
    }
  }, [topic])

  const loadQuiz = async () => {
    if (!topic.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const newQuiz = await generateQuiz({ topic: topic.trim(), difficulty })
      setQuiz(newQuiz)
      setLastQuiz(newQuiz)
      setAnswers({})
      setSubmitted(false)
      setScore(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }))
  }

  const handleSubmit = async () => {
    if (!quiz) return
    
    let correct = 0
    quiz.questions.forEach(question => {
      if (answers[question.id] === question.answerIndex) {
        correct++
      }
    })
    
    const newScore = correct
    const accuracy = Math.round((correct / quiz.questions.length) * 100)
    
    setScore(newScore)
    setSubmitted(true)
    
    try {
      await saveAttempt({
        topic: quiz.topic,
        questions: quiz.questions.length,
        score: newScore,
        accuracy
      })
    } catch (err) {
      console.error('Failed to save:', err)
    }
  }



  if (!topic.trim()) {
    return (
      <div className="card">
        <h2>Quiz</h2>
        <p>Please enter a topic on the home page to generate a quiz.</p>
      </div>
    )
  }
  if (loading) {
    return (
      <div className="card">
        <div className="loading">Generating quiz...</div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="card">
        <div className="error">{error}</div>
        <button className="btn" onClick={loadQuiz}>Try Again</button>
      </div>
    )
  }
  if (!quiz) {
    return (
      <div className="card">
        <h2>Quiz</h2>
        <p>No quiz available. Click "Generate Quiz" to create one.</p>
        <button className="btn" onClick={loadQuiz}>Generate Quiz</button>
      </div>
    )
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Quiz: {quiz.topic}</h2>
        <div>
          <button className="btn btn-secondary" onClick={loadQuiz} style={{ marginRight: '8px' }}>
            New Quiz
          </button>
          <Link to="/chat" className="btn">
            Back to Chat
          </Link>
        </div>
      </div>
      
      <div style={{ marginBottom: '16px', fontSize: '14px', color: '#6c757d' }}>
        Difficulty: {quiz.difficulty} • {quiz.questions.length} questions
      </div>

      {quiz.questions.map((question, index) => (
        <QuizCard
          key={question.id}
          question={question}
          questionNumber={index + 1}
          selectedAnswer={answers[question.id]}
          onAnswerChange={handleAnswerChange}
          submitted={submitted}
        />
      ))}

      {!submitted ? (
        <button 
          className="btn btn-success" 
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== quiz.questions.length}
          style={{ marginTop: '24px' }}
        >
          Submit Quiz
        </button>
      ) : (
        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
          <h3>Quiz Complete!</h3>
          <p>Score: {score}/{quiz.questions.length} ({Math.round((score / quiz.questions.length) * 100)}%)</p>
        </div>
      )}
    </div>
  )
}
