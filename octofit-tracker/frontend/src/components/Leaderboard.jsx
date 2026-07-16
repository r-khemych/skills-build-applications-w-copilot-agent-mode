import { useEffect, useMemo, useState } from 'react'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const apiHost = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'
const endpoint = `${apiHost}/api/leaderboard/`

function normalizeCollection(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  const directCollections = ['data', 'results', 'items']
  for (const key of directCollections) {
    if (Array.isArray(payload[key])) {
      return payload[key]
    }
  }

  const nestedCollections = ['data', 'results']
  for (const key of nestedCollections) {
    const nested = payload[key]
    if (!nested || typeof nested !== 'object') {
      continue
    }

    for (const nestedKey of directCollections) {
      if (Array.isArray(nested[nestedKey])) {
        return nested[nestedKey]
      }
    }
  }

  return []
}

function formatDate(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return date.toLocaleDateString()
}

export default function Leaderboard() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchLeaderboard() {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(endpoint, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const payload = await response.json()
        const leaderboard = normalizeCollection(payload)
        const flattened = leaderboard.flatMap((week) => {
          const entries = Array.isArray(week.entries) ? week.entries : []
          return entries.map((entry, index) => ({
            id: `${week._id ?? week.weekStart}-${entry.user?._id ?? index}`,
            weekStart: week.weekStart,
            rank: entry.rank,
            score: entry.score,
            userName: entry.user?.fullName,
            userEmail: entry.user?.email,
          }))
        })
        setRows(flattened)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Failed to load leaderboard.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
    return () => controller.abort()
  }, [])

  const title = useMemo(() => `Leaderboard Entries (${rows.length})`, [rows.length])

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">{title}</h2>
        {!codespaceName && (
          <div className="alert alert-warning py-2" role="alert">
            VITE_CODESPACE_NAME is not set. Using localhost fallback.
          </div>
        )}
        {isLoading && <p className="mb-0">Loading leaderboard...</p>}
        {!isLoading && error && <div className="alert alert-danger mb-0">{error}</div>}
        {!isLoading && !error && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{formatDate(row.weekStart)}</td>
                    <td>{row.rank ?? '-'}</td>
                    <td>{row.userName ?? '-'}</td>
                    <td>{row.userEmail ?? '-'}</td>
                    <td>{row.score ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
