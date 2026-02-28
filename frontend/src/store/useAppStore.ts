import { create } from 'zustand'

export const useAppStore = create((set) => ({
  topic: '',
  difficulty: 'medium',
  transcript: '',
  chatHistory: [],
  micTimer: {
    startedAt: null,
    totalMs: 0
  },
  lastQuiz: null,
  
  setTopic: (topic: string) => set({ topic }),
  setDifficulty: (difficulty: string) => set({ difficulty }),
  setTranscript: (transcript: string) => set({ transcript }),
  
  addChatMessage: (message) => set((state) => ({
    chatHistory: [...state.chatHistory, message]
  })),
  
  clearChatHistory: () => set({ chatHistory: [] }),
  
  startMicTimer: () => set((state) => ({
    micTimer: {
      ...state.micTimer,
      startedAt: Date.now()
    }
  })),
  
  stopMicTimer: () => set((state) => {
    if (state.micTimer.startedAt) {
      const elapsed = Date.now() - state.micTimer.startedAt
      return {
        micTimer: {
          startedAt: null,
          totalMs: state.micTimer.totalMs + elapsed
        }
      }
    }
    return state
  }),
  
  resetMicTimer: () => set({
    micTimer: {
      startedAt: null,
      totalMs: 0
    }
  }),
  
  setLastQuiz: (quiz) => set({ lastQuiz: quiz })
}))
