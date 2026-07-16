import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import Activities from './components/Activities'
import Leaderboard from './components/Leaderboard'
import Teams from './components/Teams'
import Users from './components/Users'
import Workouts from './components/Workouts'

function App() {
  return (
    <main className="container py-4">
      <header className="mb-4">
        <h1 className="mb-2">Octofit Tracker</h1>
        <p className="mb-3">Monitor users, teams, activities, workouts, and leaderboard standings.</p>
        <nav className="nav nav-pills flex-wrap gap-2">
          <NavLink className="btn btn-outline-primary" to="/users">
            Users
          </NavLink>
          <NavLink className="btn btn-outline-primary" to="/teams">
            Teams
          </NavLink>
          <NavLink className="btn btn-outline-primary" to="/activities">
            Activities
          </NavLink>
          <NavLink className="btn btn-outline-primary" to="/workouts">
            Workouts
          </NavLink>
          <NavLink className="btn btn-outline-primary" to="/leaderboard">
            Leaderboard
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<Users />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </main>
  )
}

export default App
