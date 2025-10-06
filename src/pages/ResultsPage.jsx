import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function ResultsPage({ onRestart }) {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state || {}
  const { score = 0, questions = [], answers = [] } = state

  function restart() {
    if (onRestart) onRestart()
    else navigate('/quiz')
  }

  return (
    <div className="results-page">
      <header>
        <h1>Results</h1>
        <div className="score">You scored {score} / {questions.length}</div>
      </header>

      <main>
        <ul className="results-list">
          {questions.map((q) => {
            const a = answers.find((x) => x.questionId === q.id) || {}
            const correct = a.correct
            return (
              <li key={q.id} className={`result-item ${correct ? 'correct' : 'incorrect'}`}>
                <div className="q-text">{q.question}</div>
                <div className="q-answers">
                  <div>Your answer: <strong>{a.selected ?? '—'}</strong></div>
                  <div>Correct answer: <strong>{q.answer}</strong></div>
                </div>
              </li>
            )
          })}
        </ul>
      </main>

      <footer>
        <button className="btn primary" onClick={restart}>Restart Quiz</button>
      </footer>
    </div>
  )
}
