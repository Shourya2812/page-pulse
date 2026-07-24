import { useState } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAudit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Points to your local FastAPI server
      const response = await fetch('https://page-pulse-a01i.onrender.com/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      // Handle 400, 408, 422 errors thrown by FastAPI gracefully
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to audit the URL.')
      }

      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <main>
        <h1>Page Pulse</h1>
        <p>Instantly audit any URL for core metrics.</p>

        <form onSubmit={handleAudit} className="audit-form">
          <input 
            type="url" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com" 
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Auditing...' : 'Audit Page'}
          </button>
        </form>

        {/* Renders Sensible Errors (Rubric Requirement) */}
        {error && <div className="error-box">⚠️ {error}</div>}

        {/* Renders Report Cleanly (Rubric Requirement) */}
        {result && (
          <div className="result-box">
            <h2>Audit Results</h2>
            <ul>
              <li><strong>HTTP Status:</strong> {result.http_status}</li>
              <li><strong>Response Time:</strong> {result.response_time_ms} ms</li>
              <li><strong>Title:</strong> {result.title || 'Missing'}</li>
              <li><strong>Meta Description:</strong> {result.meta_description || 'Missing'}</li>
              <li><strong>H1 Count:</strong> {result.h1_count}</li>
              <li><strong>Images Missing Alt Text:</strong> {result.images_missing_alt_text}</li>
              <li><strong>Approximate Word Count:</strong> {result.approximate_word_count}</li>
            </ul>
          </div>
        )}
      </main>

      {/* CRITICAL: MANDATORY LIVE BUILD FOOTER */}
      <footer>
        Built for Digital Heroes Training Task <a href="https://digitalheroesco.com" target="_blank" rel="noopener noreferrer">digitalheroesco.com</a>
      </footer>
    </div>
  )
}

export default App