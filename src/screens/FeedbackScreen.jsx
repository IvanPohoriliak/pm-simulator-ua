import { useState, useEffect } from 'react'
import { generateAIFeedback } from '../utils/claudeAPI'

function FeedbackScreen({ weekNumber, weekTitle, selectedOption, metrics, onContinue, weekData, oldMetrics }) {
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFeedback() {
      setLoading(true)
      const result = await generateAIFeedback(
        weekNumber,
        weekTitle,
        selectedOption.id,
        selectedOption.title,
        metrics,
        weekData,
        selectedOption,
        oldMetrics
      )
      setFeedback(result)
      setLoading(false)
    }
    loadFeedback()
  }, [weekNumber, weekTitle, selectedOption, metrics, weekData, oldMetrics])

  const isLastWeek = weekNumber >= 12

  return (
    <div className="feedback-screen">
      <div className="feedback-content">
        <h3>AI Feedback</h3>
        
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Generating feedback...</p>
          </div>
        ) : (
          <p className="feedback-text">{feedback}</p>
        )}
      </div>

      <div className="btn-center">
        <button 
          className="btn-primary" 
          onClick={onContinue}
          disabled={loading}
        >
          {isLastWeek ? 'See Final Review' : `Continue to Week ${weekNumber + 1}`}
        </button>
      </div>
    </div>
  )
}

export default FeedbackScreen
