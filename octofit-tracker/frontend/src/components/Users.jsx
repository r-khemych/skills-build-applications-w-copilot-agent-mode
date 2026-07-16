import { useEffect, useMemo, useState } from 'react'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/'

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

export default function Users() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchUsers() {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(endpoint, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const payload = await response.json()
        setUsers(normalizeCollection(payload))
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Failed to load users.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
    return () => controller.abort()
  }, [])

  const title = useMemo(() => `Users (${users.length})`, [users.length])

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">{title}</h2>
        {!codespaceName && (
          <div className="alert alert-warning py-2" role="alert">
            VITE_CODESPACE_NAME is not set. Using localhost fallback.
          </div>
        )}
        {isLoading && <p className="mb-0">Loading users...</p>}
        {!isLoading && error && <div className="alert alert-danger mb-0">{error}</div>}
        {!isLoading && !error && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Level</th>
                  <th>Goal (min/week)</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id ?? user.email}>
                    <td>{user.fullName ?? '-'}</td>
                    <td>{user.email ?? '-'}</td>
                    <td>{user.age ?? '-'}</td>
                    <td>{user.fitnessLevel ?? '-'}</td>
                    <td>{user.weeklyGoalMinutes ?? '-'}</td>
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
