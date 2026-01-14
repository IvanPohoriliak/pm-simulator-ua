function ConsequencesScreen({ consequences, onContinue }) {
  const { option, oldMetrics, newMetrics } = consequences

  const getChange = (old, current) => {
    const diff = current - old
    if (diff > 0) return { value: `+${diff}`, type: 'positive' }
    if (diff < 0) return { value: diff, type: 'negative' }
    return { value: '→', type: 'neutral' }
  }

  const metrics = [
    { label: '🔵 Client Trust', old: oldMetrics.clientTrust, new: newMetrics.clientTrust },
    { label: '🟢 Team Mood', old: oldMetrics.teamMood, new: newMetrics.teamMood },
    { label: '🔴 Tech Debt', old: oldMetrics.techDebt, new: newMetrics.techDebt },
    { label: '🟠 Timeline Risk', old: oldMetrics.timelineRisk, new: newMetrics.timelineRisk }
  ]

  return (
    <div className="consequences-screen">
      <div className="consequences-header">
        <h1>Decision Made</h1>
      </div>

      <div className="chosen-option">
        <h3>You chose:</h3>
        <h2>✓ Option {option.id}: {option.title}</h2>
      </div>

      <div className="outcome-section">
        <h3>Immediate Outcome</h3>
        <p className="outcome-text">{option.consequences.immediate}</p>
      </div>

      <div className="metrics-changes">
        <h3>Metrics Changed</h3>
        {metrics.map((metric, index) => {
          const change = getChange(metric.old, metric.new)
          return (
            <div key={index} className="metric-change">
              <span className="metric-label">{metric.label}</span>
              <div className="change-arrow">
                <span>{metric.old}</span>
                <span>→</span>
                <span>{metric.new}</span>
                <span className={`change-value ${change.type}`}>
                  {change.value}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="btn-center">
        <button className="btn-primary" onClick={onContinue}>
          See AI Feedback
        </button>
      </div>
    </div>
  )
}

export default ConsequencesScreen
