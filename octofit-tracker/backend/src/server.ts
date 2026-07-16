import express from 'express';
import './config/database';
import { Activity } from './models/Activity';
import { Leaderboard } from './models/Leaderboard';
import { Team } from './models/Team';
import { User } from './models/User';
import { Workout } from './models/Workout';

const app = express();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const localhostApiBaseUrl = `http://localhost:${port}`;
const codespacesApiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : null;
const apiBaseUrl = codespacesApiBaseUrl ?? localhostApiBaseUrl;

app.use(express.json());

const usersRouter = express.Router();
usersRouter.get('/', async (_req, res) => {
  try {
    const users = await User.find().populate('team', 'name city').lean();
    res.json({ route: '/api/users/', count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ route: '/api/users/', error: 'Failed to fetch users', details: error });
  }
});

const teamsRouter = express.Router();
teamsRouter.get('/', async (_req, res) => {
  try {
    const teams = await Team.find().populate('members', 'fullName email').lean();
    res.json({ route: '/api/teams/', count: teams.length, data: teams });
  } catch (error) {
    res.status(500).json({ route: '/api/teams/', error: 'Failed to fetch teams', details: error });
  }
});

const activitiesRouter = express.Router();
activitiesRouter.get('/', async (_req, res) => {
  try {
    const activities = await Activity.find()
      .populate('user', 'fullName email fitnessLevel')
      .sort({ performedAt: -1 })
      .lean();
    res.json({ route: '/api/activities/', count: activities.length, data: activities });
  } catch (error) {
    res
      .status(500)
      .json({ route: '/api/activities/', error: 'Failed to fetch activities', details: error });
  }
});

const leaderboardRouter = express.Router();
leaderboardRouter.get('/', async (_req, res) => {
  try {
    const leaderboard = await Leaderboard.find()
      .populate('entries.user', 'fullName email')
      .sort({ weekStart: -1 })
      .lean();
    res.json({ route: '/api/leaderboard/', count: leaderboard.length, data: leaderboard });
  } catch (error) {
    res
      .status(500)
      .json({ route: '/api/leaderboard/', error: 'Failed to fetch leaderboard', details: error });
  }
});

const workoutsRouter = express.Router();
workoutsRouter.get('/', async (_req, res) => {
  try {
    const workouts = await Workout.find().lean();
    res.json({ route: '/api/workouts/', count: workouts.length, data: workouts });
  } catch (error) {
    res
      .status(500)
      .json({ route: '/api/workouts/', error: 'Failed to fetch workouts', details: error });
  }
});

app.use('/api/users', usersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/workouts', workoutsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', apiBaseUrl });
});

app.listen(port, () => {
  console.log(`OctoFit backend listening on ${apiBaseUrl}`);
});
