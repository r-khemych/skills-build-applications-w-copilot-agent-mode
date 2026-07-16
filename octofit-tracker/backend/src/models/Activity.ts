import { Model, Schema, Types, model, models } from 'mongoose';

export interface IActivity {
  user: Types.ObjectId;
  type: 'run' | 'bike' | 'swim' | 'strength' | 'yoga' | 'hiit';
  durationMinutes: number;
  caloriesBurned: number;
  distanceKm?: number;
  performedAt: Date;
}

type ActivityModel = Model<IActivity>;

const activitySchema = new Schema<IActivity, ActivityModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['run', 'bike', 'swim', 'strength', 'yoga', 'hiit'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 5 },
    caloriesBurned: { type: Number, required: true, min: 20 },
    distanceKm: { type: Number, min: 0 },
    performedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Activity =
  (models.Activity as ActivityModel) || model<IActivity, ActivityModel>('Activity', activitySchema);
