import { useState, useEffect } from 'react'
import { generateAIFeedback } from '../utils/claudeAPI'

function FeedbackScreen({ weekNumber, weekTitle, selectedOption, metrics, onContinue, weekData, oldMetrics }) {
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(true)
  const [isStreaming, setIsStreaming] = useState(false)

  useEffect(() => {
    async function loadFeedback() {
      setLoading(true)
      setIsStreaming(true)
      
      // 👇 STREAMING: update feedback as it arrives
      await generateAIFeedback(
        weekNumber,
        weekTitle,
        selectedOption.id,
        selectedOption.title,
        metrics,
        weekData,
        selectedOption,
        oldMetrics,
        (chunk) => {
          // This callback is called for each chunk of text
          setFeedback(chunk)
          setLoading(false) // Stop showing spinner after first chunk
        }
      )
      
      setIsStreaming(false)
    }
    
    loadFeedback()
  }, [weekNumber, weekTitle, selectedOption, metrics, weekData, oldMetrics])

  const isLastWeek = weekNumber >= 12

  return (
    <div className="feedback-screen">
      <div className="feedback-content">
        <h3>Фідбек від AI</h3>
        
        {loading && feedback === '' ? (
          // Only show spinner if no text yet
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Генерую фідбек...</p>
            
            {/* Skip button while loading */}
            <button 
              className="btn-secondary" 
              onClick={onContinue}
              style={{ marginTop: '20px' }}
            >
              Пропустити фідбек →
            </button>
          </div>
        ) : (
          <>
            <p className="feedback-text">{feedback}</p>
            
            {/* Show "typing" indicator while streaming */}
            {isStreaming && (
              <span className="typing-indicator">▋</span>
            )}
          </>
        )}
      </div>

      <div className="btn-center">
        <button 
          className="btn-primary" 
          onClick={onContinue}
          disabled={loading && feedback === ''}
        >
          {isLastWeek ? 'Переглянути результати проєкту' : `Перейти до тижня ${weekNumber + 1}`}
        </button>
      </div>
    </div>
  )
}

export default FeedbackScreen
