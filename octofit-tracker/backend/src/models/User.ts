import { HydratedDocument, Model, Schema, model, models, Types } from 'mongoose';

export interface IUser {
  fullName: string;
  email: string;
  age: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  weeklyGoalMinutes: number;
  team?: Types.ObjectId;
}

type UserModel = Model<IUser>;

const userSchema = new Schema<IUser, UserModel>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    age: { type: Number, required: true, min: 13, max: 100 },
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    weeklyGoalMinutes: { type: Number, required: true, min: 30, max: 1200 },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
  },
  { timestamps: true }
);

export type UserDocument = HydratedDocument<IUser>;
export const User = (models.User as UserModel) || model<IUser, UserModel>('User', userSchema);
