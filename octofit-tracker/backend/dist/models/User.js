"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    age: { type: Number, required: true, min: 13, max: 100 },
    fitnessLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true,
    },
    weeklyGoalMinutes: { type: Number, required: true, min: 30, max: 1200 },
    team: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team' },
}, { timestamps: true });
exports.User = mongoose_1.models.User || (0, mongoose_1.model)('User', userSchema);
