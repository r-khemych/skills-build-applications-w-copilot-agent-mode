"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const mongoose_1 = require("mongoose");
const teamSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    city: { type: String, required: true, trim: true },
    motto: { type: String, required: true, trim: true },
    points: { type: Number, required: true, default: 0, min: 0 },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }],
}, { timestamps: true });
exports.Team = mongoose_1.models.Team || (0, mongoose_1.model)('Team', teamSchema);
