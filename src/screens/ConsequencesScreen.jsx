function ConsequencesScreen({ consequences, onContinue }) {
  const { option, oldMetrics, newMetrics } = consequences

  const getChange = (old, current) => {
    const diff = current - old
    if (diff > 0) return { value: `+${diff}`, type: 'positive' }
    if (diff < 0) return { value: diff, type: 'negative' }
    return { value: '→', type: 'neutral' }
  }

  const metrics = [
    { label: '🔵 Довіра клієнта', old: oldMetrics.clientTrust, new: newMetrics.clientTrust },
    { label: '🟢 Настрій команди', old: oldMetrics.teamMood, new: newMetrics.teamMood },
    { label: '🔴 Техборг', old: oldMetrics.techDebt, new: newMetrics.techDebt },
    { label: '🟠 Ризик дедлайну', old: oldMetrics.timelineRisk, new: newMetrics.timelineRisk }
  ]

  return (
    <div className="consequences-screen">
      <div className="consequences-header">
        <h1>Рішення прийнято</h1>
      </div>

      <div className="chosen-option">
        <h3>Ви обрали:</h3>
        <h2>✓ Опція {option.id}: {option.title}</h2>
      </div>

      <div className="outcome-section">
        <h3>Наслідки</h3>
        <p className="outcome-text">{option.consequences.immediate}</p>
      </div>

      <div className="metrics-changes">
        <h3>Зміни метрик</h3>
        {metrics.map((metric, index) => {
          const change = getChange(metric.old, metric.new)
          return (
            <div key={index} className="metric-change">
              <span className="metric-label">{metric.label}</span>
              <div className="change-arrow">
                <span>{metric.old}</span>
                <span>→</span>
                <span>{metri