"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Activity_1 = require("../models/Activity");
const Leaderboard_1 = require("../models/Leaderboard");
const Team_1 = require("../models/Team");
const User_1 = require("../models/User");
const Workout_1 = require("../models/Workout");
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
    try {
        await mongoose_1.default.connect(connectionString);
        console.log('Connected to octofit_db');
        await Promise.all([
            User_1.User.deleteMany({}),
            Team_1.Team.deleteMany({}),
            Activity_1.Activity.deleteMany({}),
            Leaderboard_1.Leaderboard.deleteMany({}),
            Workout_1.Workout.deleteMany({}),
        ]);
        const users = await User_1.User.insertMany([
            {
                fullName: 'Lena Kovalenko',
                email: 'lena.kovalenko@octofit.dev',
                age: 29,
                fitnessLevel: 'intermediate',
                weeklyGoalMinutes: 240,
            },
            {
                fullName: 'Maksym Bondar',
                email: 'maksym.bondar@octofit.dev',
                age: 34,
                fitnessLevel: 'advanced',
                weeklyGoalMinutes: 320,
            },
            {
                fullName: 'Iryna Shevchenko',
                email: 'iryna.shevchenko@octofit.dev',
                age: 26,
                fitnessLevel: 'beginner',
                weeklyGoalMinutes: 180,
            },
            {
                fullName: 'Taras Melnyk',
                email: 'taras.melnyk@octofit.dev',
                age: 31,
                fitnessLevel: 'intermediate',
                weeklyGoalMinutes: 210,
            },
        ]);
        const teams = await Team_1.Team.insertMany([
            {
                name: 'Morning Milers',
                city: 'Kyiv',
                motto: 'Sunrise miles, all smiles.',
                points: 1480,
                members: [users[0]._id, users[2]._id],
            },
            {
                name: 'Iron Interval',
                city: 'Lviv',
                motto: 'Consistency beats intensity.',
                points: 1710,
                members: [users[1]._id, users[3]._id],
            },
        ]);
        users[0].team = teams[0]._id;
        users[2].team = teams[0]._id;
        users[1].team = teams[1]._id;
        users[3].team = teams[1]._id;
        await Promise.all(users.map((user) => user.save()));
        await Activity_1.Activity.insertMany([
            {
                user: users[0]._id,
                type: 'run',
                durationMinutes: 42,
                caloriesBurned: 410,
                distanceKm: 7.2,
                performedAt: new Date('2026-07-10T06:45:00Z'),
            },
            {
                user: users[1]._id,
                type: 'bike',
                durationMinutes: 55,
                caloriesBurned: 530,
                distanceKm: 21.4,
                performedAt: new Date('2026-07-11T17:20:00Z'),
            },
            {
                user: users[2]._id,
                type: 'yoga',
                durationMinutes: 30,
                caloriesBurned: 145,
                performedAt: new Date('2026-07-12T08:10:00Z'),
            },
            {
                user: users[3]._id,
                type: 'strength',
                durationMinutes: 48,
                caloriesBurned: 390,
                performedAt: new Date('2026-07-13T18:30:00Z'),
            },
            {
                user: users[0]._id,
                type: 'hiit',
                durationMinutes: 25,
                caloriesBurned: 315,
                performedAt: new Date('2026-07-14T07:15:00Z'),
            },
        ]);
        await Leaderboard_1.Leaderboard.create({
            weekStart: new Date('2026-07-06T00:00:00Z'),
            entries: [
                { user: users[1]._id, score: 925, rank: 1 },
                { user: users[0]._id, score: 860, rank: 2 },
                { user: users[3]._id, score: 790, rank: 3 },
                { user: users[2]._id, score: 640, rank: 4 },
            ],
        });
        await Workout_1.Workout.insertMany([
            {
                title: '30-Min Runner Boost',
                level: 'intermediate',
                durationMinutes: 30,
                focus: 'cardio',
                moves: [
                    { name: 'Jump Rope', seconds: 180 },
                    { name: 'Alternating Lunges', reps: 30 },
                    { name: 'Mountain Climbers', seconds: 120 },
                    { name: 'Cooldown Walk', seconds: 300 },
                ],
            },
            {
                title: 'Foundation Strength Circuit',
                level: 'beginner',
                durationMinutes: 35,
                focus: 'strength',
                moves: [
                    { name: 'Bodyweight Squats', reps: 20 },
                    { name: 'Push-ups', reps: 12 },
                    { name: 'Glute Bridge', reps: 18 },
                    { name: 'Plank Hold', seconds: 60 },
                ],
            },
            {
                title: 'Desk Reset Mobility Flow',
                level: 'advanced',
                durationMinutes: 20,
                focus: 'mobility',
                moves: [
                    { name: 'Hip CARs', reps: 10 },
                    { name: 'Thoracic Rotation', reps: 16 },
                    { name: 'Deep Squat Hold', seconds: 90 },
                    { name: 'Hamstring Reach', seconds: 120 },
                ],
            },
        ]);
        console.log('Seed the octofit_db database with test data');
        console.log('Database seeding complete');
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
