import { useState, useEffect } from 'react'
import { generateFinalReview } from '../utils/claudeAPI'

function FinalReviewScreen({ finalData, metrics, decisionHistory, scenarioData, onRestart }) {
  const [aiReview, setAiReview] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFinalReview() {
      setLoading(true)
      const review = await generateFinalReview(decisionHistory, metrics, scenarioData)
      setAiReview(review)
      setLoading(false)
    }
    loadFinalReview()
  }, [decisionHistory, metrics, scenarioData])

  return (
    <div className="final-screen">
      <div className="final-header">
        <h1 className="final-title">Проєкт завершено</h1>
        <h2>12-тижнева ретроспектива</h2>
      </div>

      <div className="final-section">
        <h3>Що сталося</h3>
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Формую підсумки проєкту...</p>
          </div>
        ) : (
          <p className="outcome-text" style={{ whiteSpace: 'pre-line' }}>{aiReview}</p>
        )}
      </div>

      <div className="final-section">
        <h3>Фінальні метрики</h3>
        <div className="metrics-dashboard">
          <div className="metric-item">
            <div className="metric-header">
              <span className="metric-label">🔵 Довіра клієнта</span>
              <span className="metric-value">{metrics.clientTrust}/100</span>
            </div>
            <div className="metric-bar-track">
              <div 
                className="metric-bar-fill blue" 
                style={{ width: `${metrics.clientTrust}%` }}
              />
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-header">
              <span className="metric-label">🟢 Настрій команди</span>
              <span className="metric-value">{metrics.teamMood}/100</span>
            </div>
            <div className="metric-bar-track">
              <div 
                className="metric-bar-fill green" 
                style={{ width: `${metrics.teamMood}%` }}
              />
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-header">
              <span className="metric-label">🔴 Техборг</span>
              <span className="metric-value">{metrics.techDebt}/100</span>
            </div>
            <div className="metric-bar-track">
              <div 
                className="metric-bar-fill red" 
                style={{ width: `${metrics.techDebt}%` }}
              />
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-header">
              <span className="metric-label">🟠 Ризик дедлайну</span>
              <span className="metric-value">{metrics.timelineRisk}/100</span>
            </div>
            <div className="metric-bar-track">
              <div 
                className="metric-bar-fill orange" 
                style={{ width: `${metrics.timelineRisk}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="final-section">
        <h3>Ваші ключові рішення</h3>
        {decisionHistory.map((decision, index) => (
          <div key={index} className="trade-off-item">
            <div className="trade-off-week">Тиждень {decision.week}</div>
            <div className="trade-off-decision">Обрано: {decision.title}</div>
          </div>
        ))}
      </div>

      <div className="btn-center">
        <button className="btn-primary" onClick={onRestart} disabled={loading}>
          Почати спочатку
        </button>
      </div>
    </div>
  )
}

export default FinalReviewScreen