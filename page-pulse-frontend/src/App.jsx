import { useState } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false) 

  const handleAudit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setIsLoading(true);

    try {
      const response = await fetch('https://page-pulse-a01i.onrender.com/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.detail && Array.isArray(data.detail)) {
          throw new Error(`Invalid URL: ${data.detail[0].msg}`);
        } else if (data.detail) {
          throw new Error(data.detail);
        } else {
          throw new Error('Failed to audit page');
        }
      }

      setResult(data); 
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); 
    }
  }; 

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
          <button type="submit" disabled={isLoading}> 
            {isLoading ? 'Auditing...' : 'Audit Page'}
          </button>
        </form>

        {error && <div className="error-box">⚠️ {error}</div>}

        {result && (
          <div className="result-box">
            <h2>Audit Results</h2>
            <ul>
              <li>
                <strong>HTTP Status:</strong>{' '}
                <span style={{ 
                  color: result.http_status >= 200 && result.http_status < 300 ? '#10b981' : '#ef4444', 
                  fontWeight: 'bold' 
                }}>
                  {result.http_status}
                </span>
              </li>
              <li><strong>Response Time:</strong> {result.response_time_ms} ms</li>
              <li><strong>Title:</strong> {result.title || 'Not available'}</li>
              <li><strong>Meta Description:</strong> {result.meta_description || 'Not available'}</li>
              <li><strong>H1 Count:</strong> {result.h1_count}</li>
              <li><strong>Images Missing Alt Text:</strong> {result.images_missing_alt_text}</li>
              <li><strong>Approximate Word Count:</strong> {result.approximate_word_count}</li>
            </ul>
          </div>
        )}
      </main>

      <footer>
        Built for Digital Heroes Training Task <a href="https://digitalheroesco.com" target="_blank" rel="noopener noreferrer">digitalheroesco.com</a>
      </footer>
    </div>
  )
}

export default App