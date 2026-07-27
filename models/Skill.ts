import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Other';
  level: number; // 0–100
  icon?: string; // icon name (react-icons key or custom)
  order: number;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'Database', 'Other'],
      required: true,
    },
    level: { type: Number, min: 0, max: 100, default: 80 },
    icon: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Skill: Model<ISkill> =
  mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);

export default Skill;
