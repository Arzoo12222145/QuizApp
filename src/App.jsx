import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import QuizPage from './pages/QuizPage'
import ResultsPage from './pages/ResultsPage'
import { decodeHtml, shuffle } from './utils'
import bundledData from './questions.json'

const API_URL = 'https://opentdb.com/api.php'

function App() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const [source, setSource] = useState('local') // 'local' or 'api'
  const [amount, setAmount] = useState(7)
  const [difficulty, setDifficulty] = useState('any')

  useEffect(() => {
    // initial load uses local JSON
    loadLocal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function loadLocal() {
    setLoading(true)
    try {
      const data = bundledData
      setQuestions(data.questions || [])
      setLoading(false)
    } catch (err) {
      console.error(err)
      setError('Failed to load bundled questions')
      setLoading(false)
    }
  }

  async function loadFromApi() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('amount', amount)
      if (difficulty !== 'any') params.set('difficulty', difficulty)
      params.set('type', 'multiple')
      const res = await fetch(`${API_URL}?${params.toString()}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch from Open Trivia DB')
      const data = await res.json()
      if (data.response_code !== 0) throw new Error('API returned no results')

      // normalize
      const normalized = data.results.map((item, idx) => {
        const question = decodeHtml(item.question)
        const correct = decodeHtml(item.correct_answer)
        const incorrect = item.incorrect_answers.map(decodeHtml)
        const options = shuffle([correct, ...incorrect])
        return { id: idx + 1, question, options, answer: correct }
      })
      setQuestions(normalized)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
      // fallback to local data
      loadLocal()
    }
  }

  function handleRestart() {
    navigate('/quiz')
    // reload according to current source
    if (source === 'api') loadFromApi()
    else loadLocal()
  }

  if (loading) return <div className="center">Loading questions…</div>

  return (
    <div className="app-container">
      <div className="card" style={{marginBottom:12}}>
        <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'center'}}>
          <label>Source:</label>
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="local">Local (bundled)</option>
            <option value="api">Open Trivia DB</option>
          </select>

          {source === 'api' && (
            <>
              <label>Amount:</label>
              <input type="number" min={5} max={50} value={amount} onChange={(e)=>setAmount(Number(e.target.value))} style={{width:70}} />
              <label>Difficulty:</label>
              <select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)}>
                <option value="any">Any</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <button className="btn primary" onClick={loadFromApi}>Load from API</button>
            </>
          )}

          {source === 'local' && (
            <button className="btn" onClick={loadLocal}>Load local questions</button>
          )}
        </div>
        {error && <div style={{color:'crimson',marginTop:8}}>Error: {error}</div>}
      </div>

      <Routes>
        <Route path="/" element={<QuizPage questions={questions} />} />
        <Route path="/quiz" element={<QuizPage questions={questions} />} />
        <Route path="/results" element={<ResultsPage onRestart={handleRestart} />} />
      </Routes>
    </div>
  )
}

export default App
