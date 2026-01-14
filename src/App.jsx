import { useState } from 'react'
import WelcomeScreen from './screens/WelcomeScreen'
import ProjectBriefScreen from './screens/ProjectBriefScreen'
import WeekScreen from './screens/WeekScreen'
import ConsequencesScreen from './screens/ConsequencesScreen'
import FeedbackScreen from './screens/FeedbackScreen'
import FinalReviewScreen from './screens/FinalReviewScreen'
import scenarioData from './data/scenario-data.json'

function App() {
  // Screen navigation
  const [currentScreen, setCurrentScreen] = useState('welcome')
  
  // Week tracking
  const [currentWeek, setCurrentWeek] = useState(1)
  
  // Metrics (all start at 50)
  const [metrics, setMetrics] = useState({
    clientTrust: 50,
    teamMood: 50,
    techDebt: 50,
    timelineRisk: 50
  })
  
  // Decision tracking
  const [decisionHistory, setDecisionHistory] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [currentConsequences, setCurrentConsequences] = useState(null)

  // Navigation handlers
  const startProject = () => {
    setCurrentScreen('brief')
  }

  const beginWeek1 = () => {
    setCurrentScreen('week')
    setCurrentWeek(1)
  }

  const makeDecision = (option) => {
    // Store selected option
    setSelectedOption(option)
    
    // Calculate new metrics
    const newMetrics = {
      clientTrust: clamp(metrics.clientTrust + option.consequences.metrics.clientTrust, 0, 100),
      teamMood: clamp(metrics.teamMood + option.consequences.metrics.teamMood, 0, 100),
      techDebt: clamp(metrics.techDebt + option.consequences.metrics.techDebt, 0, 100),
      timelineRisk: clamp(metrics.timelineRisk + option.consequences.metrics.timelineRisk, 0, 100)
    }
    
    // Store consequences for display
    setCurrentConsequences({
      option: option,
      oldMetrics: { ...metrics },
      newMetrics: newMetrics
    })
    
    // Update metrics
    setMetrics(newMetrics)
    
    // Add to history
    setDecisionHistory([
      ...decisionHistory,
      {
        week: currentWeek,
        optionId: option.id,
        title: option.title
      }
    ])
    
    // Navigate to consequences
    setCurrentScreen('consequences')
  }

  const viewFeedback = () => {
    setCurrentScreen('feedback')
  }

  const continueToNextWeek = () => {
    if (currentWeek >= 3) {
      // End of available weeks, go to final review
      setCurrentScreen('final')
    } else {
      // Next week
      setCurrentWeek(currentWeek + 1)
      setSelectedOption(null)
      setCurrentScreen('week')
    }
  }

  const restartSimulation = () => {
    setCurrentScreen('welcome')
    setCurrentWeek(1)
    setMetrics({
      clientTrust: 50,
      teamMood: 50,
      techDebt: 50,
      timelineRisk: 50
    })
    setDecisionHistory([])
    setSelectedOption(null)
    setCurrentConsequences(null)
  }

  // Helper to clamp values between 0-100
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }

  // Render current screen
  return (
    <div className="app-container">
      {currentScreen === 'welcome' && (
        <WelcomeScreen onStart={startProject} />
      )}
      
      {currentScreen === 'brief' && (
        <ProjectBriefScreen 
          data={scenarioData.projectBrief}
          onBegin={beginWeek1}
        />
      )}
      
      {currentScreen === 'week' && (
        <WeekScreen
          weekData={scenarioData.weeks[currentWeek - 1]}
          weekNumber={currentWeek}
          metrics={metrics}
          onDecision={makeDecision}
        />
      )}
      
      {currentScreen === 'consequences' && (
        <ConsequencesScreen
          consequences={currentConsequences}
          onContinue={viewFeedback}
        />
      )}
      
      {currentScreen === 'feedback' && (
        <FeedbackScreen
          weekNumber={currentWeek}
          weekTitle={scenarioData.weeks[currentWeek - 1].title}
          selectedOption={selectedOption}
          metrics={metrics}
          onContinue={continueToNextWeek}
        />
      )}
      
      {currentScreen === 'final' && (
        <FinalReviewScreen
          finalData={scenarioData.finalReview}
          metrics={metrics}
          decisionHistory={decisionHistory}
          onRestart={restartSimulation}
        />
      )}
    </div>
  )
}

export default App
