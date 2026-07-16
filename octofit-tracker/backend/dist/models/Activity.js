"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
const mongoose_1 = require("mongoose");
const activitySchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['run', 'bike', 'swim', 'strength', 'yoga', 'hiit'],
        required: true,
    },
    durationMinutes: { type: Number, required: true, min: 5 },
    caloriesBurned: { type: Number, required: true, min: 20 },
    distanceKm: { type: Number, min: 0 },
    performedAt: { type: Date, required: true },
}, { timestamps: true });
exports.Activity = mongoose_1.models.Activity || (0, mongoose_1.model)('Activity', activitySchema);
