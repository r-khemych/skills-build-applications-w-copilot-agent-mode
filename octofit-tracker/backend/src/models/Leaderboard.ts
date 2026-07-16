import { Model, Schema, Types, model, models } from 'mongoose';

interface ILeaderboardEntry {
  user: Types.ObjectId;
  score: number;
  rank: number;
}

export interface ILeaderboard {
  weekStart: Date;
  entries: ILeaderboardEntry[];
}

type LeaderboardModel = Model<ILeaderboard>;

const leaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const leaderboardSchema = new Schema<ILeaderboard, LeaderboardModel>(
  {
    weekStart: { type: Date, required: true },
    entries: { type: [leaderboardEntrySchema], required: true, default: [] },
  },
  { timestamps: true }
);

export const Leaderboard =
  (models.Leaderboard as LeaderboardModel) ||
  model<ILeaderboard, LeaderboardModel>('Leaderboard', leaderboardSchema);
