import { useEffect, useMemo, useState } from 'react'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const apiHost = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'
const endpoint = `${apiHost}/api/teams/`

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

export default function Teams() {
  const [teams, setTeams] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchTeams() {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(endpoint, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const payload = await response.json()
        setTeams(normalizeCollection(payload))
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Failed to load teams.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeams()
    return () => controller.abort()
  }, [])

  const title = useMemo(() => `Teams (${teams.length})`, [teams.length])

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">{title}</h2>
        {!codespaceName && (
          <div className="alert alert-warning py-2" role="alert">
            VITE_CODESPACE_NAME is not set. Using localhost fallback.
          </div>
        )}
        {isLoading && <p className="mb-0">Loading teams...</p>}
        {!isLoading && error && <div className="alert alert-danger mb-0">{error}</div>}
        {!isLoading && !error && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>City</th>
                  <th>Motto</th>
                  <th>Points</th>
                  <th>Members</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team._id ?? team.name}>
                    <td>{team.name ?? '-'}</td>
                    <td>{team.city ?? '-'}</td>
                    <td>{team.motto ?? '-'}</td>
                    <td>{team.points ?? 0}</td>
                    <td>{Array.isArray(team.members) ? team.members.length : 0}</td>
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
