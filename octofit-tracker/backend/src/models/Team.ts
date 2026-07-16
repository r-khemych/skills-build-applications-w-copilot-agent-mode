import { Model, Schema, Types, model, models } from 'mongoose';

export interface ITeam {
  name: string;
  city: string;
  motto: string;
  points: number;
  members: Types.ObjectId[];
}

type TeamModel = Model<ITeam>;

const teamSchema = new Schema<ITeam, TeamModel>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    city: { type: String, required: true, trim: true },
    motto: { type: String, required: true, trim: true },
    points: { type: Number, required: true, default: 0, min: 0 },
    members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  },
  { timestamps: true }
);

export const Team = (models.Team as TeamModel) || model<ITeam, TeamModel>('Team', teamSchema);
