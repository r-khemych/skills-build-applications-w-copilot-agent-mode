import { useEffect, useMemo, useState } from 'react'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/'

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

  return date.toLocaleString()
}

export default function Activities() {
  const [activities, setActivities] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchActivities() {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(endpoint, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const payload = await response.json()
        setActivities(normalizeCollection(payload))
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Failed to load activities.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
    return () => controller.abort()
  }, [])

  const title = useMemo(() => `Activities (${activities.length})`, [activities.length])

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">{title}</h2>
        {!codespaceName && (
          <div className="alert alert-warning py-2" role="alert">
            VITE_CODESPACE_NAME is not set. Using localhost fallback.
          </div>
        )}
        {isLoading && <p className="mb-0">Loading activities...</p>}
        {!isLoading && error && <div className="alert alert-danger mb-0">{error}</div>}
        {!isLoading && !error && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Calories</th>
                  <th>Distance (km)</th>
                  <th>Performed At</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity._id ?? `${activity.type}-${activity.performedAt}`}>
                    <td>{activity.user?.fullName ?? '-'}</td>
                    <td>{activity.type ?? '-'}</td>
                    <td>{activity.durationMinutes ?? '-'}</td>
                    <td>{activity.caloriesBurned ?? '-'}</td>
                    <td>{activity.distanceKm ?? '-'}</td>
                    <td>{formatDate(activity.performedAt)}</td>
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
