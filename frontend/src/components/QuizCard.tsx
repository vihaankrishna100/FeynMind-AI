import { QuizQuestion } from '../types'

export default function QuizCard({ question, questionNumber, selectedAnswer, onAnswerChange, submitted }) {
  const isCorrect = selectedAnswer === question.answerIndex
  const showExplanation = submitted

  return (
    <div className="quiz-question">

      <h3>Question {questionNumber}</h3>
      <p style={{ marginBottom: '16px' }}>{question.prompt}</p>
      
      <div>
        {question.choices.map((choice, index) => (
          <div key={index} className="quiz-choice">
            <label>
              <input
                type="radio"
                name={question.id}

                value={index}
                checked={selectedAnswer === index}
                onChange={() => onAnswerChange(question.id, index)}
                disabled={submitted}
              />
              {choice}
            </label>
          </div>
        ))}
      </div>

      {showExplanation && (
        <div className={`explanation ${isCorrect ? 'correct' : 'incorrect'}`}>
          
          <strong>{isCorrect ? 'Correct!' : 'Incorrect.'}</strong>
          <p style={{ marginTop: '8px' }}>{question.explanation}</p>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#6c757d' }}>
            Bloom's Taxonomy: {question.bloom}
          </div>
        </div>
      )}
    </div>
  )
}
