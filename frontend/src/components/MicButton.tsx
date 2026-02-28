import { useState, useEffect, useRef } from 'react'

export default function MicButton({ onTranscriptUpdate, onStart, onStop }) {
  const [isRecording, setIsRecording] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)


  
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
        onTranscriptUpdate(finalTranscript + interimTranscript)
      }



      recognitionRef.current.onstart = () => {
        setIsRecording(true)
        onStart()
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
        onStop()
      }

      setIsSupported(true)
    }
  }, [onTranscriptUpdate, onStart, onStop])

  
  const toggleRecording = () => {
    if (!recognitionRef.current) return

    if (isRecording) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
  }

  if (!isSupported) {
    return (
      <div style={{ fontSize: '14px', color: '#6c757d' }}>
        Microphone not supported
      </div>
    )
  }

  return (
    <button
      className={`btn mic-button ${isRecording ? 'recording' : ''}`}
      onClick={toggleRecording}
      type="button"
    >
      {isRecording && <div className="mic-indicator" />}
      {isRecording ? 'Stop Recording' : 'Start Recording'}
    </button>
  )
}

declare global {
  interface Window {
    webkitSpeechRecognition: any
  }
}
