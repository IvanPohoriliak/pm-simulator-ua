import { useState } from 'react'

function WeekScreen({ weekData, weekNumber, metrics, onDecision }) {
  const [selected, setSelected] = useState(null)

  const handleOptionClick = (option) => {
    setSelected(option.id)
  }

  const handleMakeDecision = () => {
    const selectedOption = weekData.options.find(opt => opt.id === selected)
    if (selectedOption) {
      onDecision(selectedOption)
    }
  }

  const progress = (weekNumber / 12) * 100

  return (
    <div className="week-screen">
      {/* Progress Bar */}
      <div className="progress-bar-container">
        <span className="progress-text">Тиждень {weekNumber} з 12</span>
        <div className="progress-bar-track">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="progress-text">{Math.round(progress)}%</span>
      </div>

      {/* Week Header */}
      <div className="week-header">
        <h1 className="week-title">Тиждень {weekNumber}: {weekData.title}</h1>
        <p className="week-phase">{weekData.phase}</p>
      </div>

      {/* Metrics Dashboard */}
      <div className="metrics-dashboard">
        <h3>Метрики проєкту</h3>
        
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

      {/* Context */}
      <div className="context-section">
        <h3>Контекст</h3>
        <p className="context-text">{weekData.context}</p>
      </div>

      {/* Signals (Slack-style messages) */}
      <div className="signals-section">
        <h3>Сигнали</h3>
        {weekData.signals.map((signal, index) => (
          <div key={index} className="signal-card">
            <div className="signal-header">
              <span className="signal-avatar">{signal.avatar}</span>
              <span className="signal-from">{signal.from}</span>
              <span className="signal-time">{signal.time}</span>
            </div>
            <p className="signal-message">{signal.message}</p>
          </div>
        ))}
      </div>

      {/* Situation */}
      <div className="situation-section">
        <h3>⚠️ Ситуація вимагає рішення</h3>
        <p>{weekData.situation}</p>
      </div>

      {/* Options */}
      <div className="options-grid">
        {weekData.options.map((option) => (
          <div
            key={option.id}
            className={`option-card ${selected === option.id ? 'selected' : ''}`}
            onClick={() => handleOptionClick(option)}
          >
            <div className="option-badge">{option.id}</div>
            <h4 className="option-title">{option.title}</h4>
            <p className="option-description">{option.description}</p>
            <p className="option-consequence">{option.shortConsequence}</p>
          </div>
        ))}
      </div>

      {/* Decision Button */}
      <button 
        className="btn-decision"
        disabled={!selected}
        onClick={handleMakeDecision}
      >
        Прийняти рішення
      </button>
    </div>
  )
}

export default WeekScreen