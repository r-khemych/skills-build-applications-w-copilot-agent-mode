"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leaderboard = void 0;
const mongoose_1 = require("mongoose");
const leaderboardEntrySchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
}, { _id: false });
const leaderboardSchema = new mongoose_1.Schema({
    weekStart: { type: Date, required: true },
    entries: { type: [leaderboardEntrySchema], required: true, default: [] },
}, { timestamps: true });
exports.Leaderboard = mongoose_1.models.Leaderboard ||
    (0, mongoose_1.model)('Leaderboard', leaderboardSchema);
