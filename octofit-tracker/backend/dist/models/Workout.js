"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workout = void 0;
const mongoose_1 = require("mongoose");
const workoutMoveSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    reps: { type: Number, min: 1 },
    seconds: { type: Number, min: 1 },
}, { _id: false });
const workoutSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    durationMinutes: { type: Number, required: true, min: 10 },
    focus: { type: String, enum: ['cardio', 'strength', 'mobility', 'recovery'], required: true },
    moves: { type: [workoutMoveSchema], required: true, default: [] },
}, { timestamps: true });
exports.Workout = mongoose_1.models.Workout || (0, mongoose_1.model)('Workout', workoutSchema);
