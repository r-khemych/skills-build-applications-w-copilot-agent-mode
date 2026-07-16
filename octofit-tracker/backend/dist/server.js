"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./config/database");
const Activity_1 = require("./models/Activity");
const Leaderboard_1 = require("./models/Leaderboard");
const Team_1 = require("./models/Team");
const User_1 = require("./models/User");
const Workout_1 = require("./models/Workout");
const app = (0, express_1.default)();
const port = 8000;
const codespacesDomain = 'app.github.dev';
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-${port}.${codespacesDomain}`
    : `http://localhost:${port}`;
app.use(express_1.default.json());
const usersRouter = express_1.default.Router();
usersRouter.get('/', async (_req, res) => {
    try {
        const users = await User_1.User.find().populate('team', 'name city').lean();
        res.json({ route: '/api/users/', count: users.length, data: users });
    }
    catch (error) {
        res.status(500).json({ route: '/api/users/', error: 'Failed to fetch users', details: error });
    }
});
const teamsRouter = express_1.default.Router();
teamsRouter.get('/', async (_req, res) => {
    try {
        const teams = await Team_1.Team.find().populate('members', 'fullName email').lean();
        res.json({ route: '/api/teams/', count: teams.length, data: teams });
    }
    catch (error) {
        res.status(500).json({ route: '/api/teams/', error: 'Failed to fetch teams', details: error });
    }
});
const activitiesRouter = express_1.default.Router();
activitiesRouter.get('/', async (_req, res) => {
    try {
        const activities = await Activity_1.Activity.find()
            .populate('user', 'fullName email fitnessLevel')
            .sort({ performedAt: -1 })
            .lean();
        res.json({ route: '/api/activities/', count: activities.length, data: activities });
    }
    catch (error) {
        res
            .status(500)
            .json({ route: '/api/activities/', error: 'Failed to fetch activities', details: error });
    }
});
const leaderboardRouter = express_1.default.Router();
leaderboardRouter.get('/', async (_req, res) => {
    try {
        const leaderboard = await Leaderboard_1.Leaderboard.find()
            .populate('entries.user', 'fullName email')
            .sort({ weekStart: -1 })
            .lean();
        res.json({ route: '/api/leaderboard/', count: leaderboard.length, data: leaderboard });
    }
    catch (error) {
        res
            .status(500)
            .json({ route: '/api/leaderboard/', error: 'Failed to fetch leaderboard', details: error });
    }
});
const workoutsRouter = express_1.default.Router();
workoutsRouter.get('/', async (_req, res) => {
    try {
        const workouts = await Workout_1.Workout.find().lean();
        res.json({ route: '/api/workouts/', count: workouts.length, data: workouts });
    }
    catch (error) {
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
