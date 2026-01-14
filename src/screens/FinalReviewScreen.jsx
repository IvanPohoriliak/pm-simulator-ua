function FinalReviewScreen({ finalData, metrics, decisionHistory, onRestart }) {
  return (
    <div className="final-screen">
      <div className="final-header">
        <h1 className="final-title">Project Complete</h1>
        <h2>{finalData.outcomeTitle}</h2>
      </div>

      <div className="final-section">
        <h3>What Happened</h3>
        <p className="outcome-text">{finalData.outcomeText}</p>
      </div>

      <div className="final-section">
        <h3>Final Metrics</h3>
        <div className="metrics-dashboard">
          <div className="metric-item">
            <div className="metric-header">
              <span className="metric-label">🔵 Client Trust</span>
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
              <span className="metric-label">🟢 Team Mood</span>
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
              <span className="metric-label">🔴 Tech Debt</span>
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
              <span className="metric-label">🟠 Timeline Risk</span>
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
        <h3>Your Key Decisions</h3>
        {decisionHistory.map((decision, index) => (
          <div key={index} className="trade-off-item">
            <div className="trade-off-week">Week {decision.week}</div>
            <div className="trade-off-decision">Chose: {decision.title}</div>
          </div>
        ))}
      </div>

      <div className="final-section">
        <h3>{finalData.reflectionTitle}</h3>
        <p className="outcome-text">{finalData.reflectionText}</p>
      </div>

      <div className="btn-center">
        <button className="btn-primary" onClick={onRestart}>
          Restart Simulation
        </button>
      </div>
    </div>
  )
}

export default FinalReviewScreen
