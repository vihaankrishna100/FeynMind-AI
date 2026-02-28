export interface QuizQuestion {
  id: string
  prompt: string
  choices: string[]
  answerIndex: number
  explanation: string
  bloom: string
}

export interface Quiz {
  topic: string
  difficulty: string
  questions: QuizQuestion[]
}
