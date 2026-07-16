import { useEffect, useMemo, useState } from 'react'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/'

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

export default function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchWorkouts() {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(endpoint, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const payload = await response.json()
        setWorkouts(normalizeCollection(payload))
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Failed to load workouts.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkouts()
    return () => controller.abort()
  }, [])

  const title = useMemo(() => `Workouts (${workouts.length})`, [workouts.length])

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">{title}</h2>
        {!codespaceName && (
          <div className="alert alert-warning py-2" role="alert">
            VITE_CODESPACE_NAME is not set. Using localhost fallback.
          </div>
        )}
        {isLoading && <p className="mb-0">Loading workouts...</p>}
        {!isLoading && error && <div className="alert alert-danger mb-0">{error}</div>}
        {!isLoading && !error && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Level</th>
                  <th>Focus</th>
                  <th>Duration</th>
                  <th>Moves</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout) => (
                  <tr key={workout._id ?? workout.title}>
                    <td>{workout.title ?? '-'}</td>
                    <td>{workout.level ?? '-'}</td>
                    <td>{workout.focus ?? '-'}</td>
                    <td>{workout.durationMinutes ?? '-'}</td>
                    <td>{Array.isArray(workout.moves) ? workout.moves.length : 0}</td>
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
