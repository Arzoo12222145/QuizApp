import React from 'react'

export default function QuestionCard({ question, onSelect, selected, locked }) {
  return (
    <div className="card">
      <h2 className="question">{question.question}</h2>

      <ul className="options">
        {question.options.map((opt) => {
          const isSelected = selected === opt
          const isCorrect = locked && opt === question.answer
          const className = `option ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''}`
          return (
            <li key={opt} className={className} onClick={() => onSelect(opt)} role="button" tabIndex={0}>
              <span className="opt-label">{opt}</span>
            </li>
          )
        })}
      </ul>

      {locked && (
        <div className="feedback">Correct answer: <strong>{question.answer}</strong></div>
      )}
    </div>
  )
}
