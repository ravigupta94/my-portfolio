import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IService {
  title: string;
  description: string;
  icon?: string;
}

export interface ICompany extends Document {
  name: string;
  tagline: string;
  description: string;
  mission: string;
  vision: string;
  services: IService[];
  teamSize: number;
  founderName: string;
  founderRole: string;
  website: string;
  location: string;
  email?: string;
  founded?: string;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    mission: { type: String, required: true },
    vision: { type: String, required: true },
    services: [
      {
        title: String,
        description: String,
        icon: String,
      },
    ],
    teamSize: { type: Number, default: 7 },
    founderName: { type: String, required: true },
    founderRole: { type: String, default: 'Founder' },
    website: { type: String },
    location: { type: String },
    email: { type: String },
    founded: { type: String },
  },
  { timestamps: true }
);

const Company: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);

export default Company;
