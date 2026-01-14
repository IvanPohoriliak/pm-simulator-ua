function WelcomeScreen({ onStart }) {
  return (
    <div className="welcome-screen">
      <h1 className="welcome-title">
        PM Simulator
        <br />
        12 Weeks in 30 Minutes
      </h1>
      <p className="welcome-subtitle">
        Your decisions are irreversible. Just like real life.
      </p>
      <button className="btn-primary" onClick={onStart}>
        Start Project
      </button>
    </div>
  )
}

export default WelcomeScreen
