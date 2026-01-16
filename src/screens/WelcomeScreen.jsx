function WelcomeScreen({ onStart }) {
  return (
    <div className="welcome-screen">
      <h1 className="welcome-title">
        PM Симулятор
        <br />
        12 тижнів за 30 хвилин
      </h1>
      <p className="welcome-subtitle">
        Ваші рішення незворотні. Як у реальному житті.
      </p>
      <button className="btn-primary" onClick={onStart}>
        Почати проєкт
      </button>
    </div>
  )
}
export default WelcomeScreen
