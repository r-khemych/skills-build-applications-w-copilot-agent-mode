import { Model, Schema, model, models } from 'mongoose';

interface IWorkoutMove {
  name: string;
  reps?: number;
  seconds?: number;
}

export interface IWorkout {
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  focus: 'cardio' | 'strength' | 'mobility' | 'recovery';
  moves: IWorkoutMove[];
}

type WorkoutModel = Model<IWorkout>;

const workoutMoveSchema = new Schema<IWorkoutMove>(
  {
    name: { type: String, required: true, trim: true },
    reps: { type: Number, min: 1 },
    seconds: { type: Number, min: 1 },
  },
  { _id: false }
);

const workoutSchema = new Schema<IWorkout, WorkoutModel>(
  {
    title: { type: String, required: true, trim: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    durationMinutes: { type: Number, required: true, min: 10 },
    focus: { type: String, enum: ['cardio', 'strength', 'mobility', 'recovery'], required: true },
    moves: { type: [workoutMoveSchema], required: true, default: [] },
  },
  { timestamps: true }
);

export const Workout =
  (models.Workout as WorkoutModel) || model<IWorkout, WorkoutModel>('Workout', workoutSchema);
