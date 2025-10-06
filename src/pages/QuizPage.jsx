import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionCard from '../shared/QuestionCard'

export default function QuizPage({ questions = [] }) {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([]) // {questionId, selected, correct}
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    // initialize answers array
    setAnswers(questions.map((q) => ({ questionId: q.id, selected: null, correct: false })))
  }, [questions])

  if (!questions || questions.length === 0) return <div className="center">No questions available</div>

  function handleSelect(option) {
    if (locked) return
    const q = questions[index]
    const isCorrect = option === q.answer
    const next = answers.map((a) => (a.questionId === q.id ? { ...a, selected: option, correct: isCorrect } : a))
    setAnswers(next)
    setLocked(true)
  }

  function next() {
    if (!locked) return // prevent moving without selection
    if (index + 1 < questions.length) {
      setIndex(index + 1)
      setLocked(false)
    } else {
      // finish - compute score and navigate to results
      const score = answers.reduce((s, a) => s + (a.correct ? 1 : 0), 0)
      navigate('/results', { state: { answers, questions, score } })
    }
  }

  function prev() {
    if (index > 0) {
      setIndex(index - 1)
      // restore locked state from answers
      const q = questions[index - 1]
      const a = answers.find((x) => x.questionId === q.id)
      setLocked(!!(a && a.selected !== null))
    }
  }

  const q = questions[index]
  const currentAnswer = answers.find((a) => a.questionId === q.id)

  return (
    <div className="quiz-page">
      <header className="quiz-header">
        <h1>Quiz App</h1>
        <div className="progress">Question {index + 1} of {questions.length}</div>
      </header>

      <main>
        <QuestionCard
          question={q}
          onSelect={handleSelect}
          selected={currentAnswer ? currentAnswer.selected : null}
          locked={locked}
        />
      </main>

      <footer className="quiz-footer">
        <button onClick={prev} disabled={index === 0} className="btn secondary">Previous</button>
        <button onClick={next} className="btn primary">{index + 1 === questions.length ? 'Finish' : 'Next'}</button>
      </footer>
    </div>
  )
}
