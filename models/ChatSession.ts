import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ILeadCapture {
  name?: string;
  projectType?: string;
  timeline?: string;
  contactInfo?: string;
}

export interface IChatSession extends Document {
  sessionId: string;
  messages: IMessage[];
  leadCapture?: ILeadCapture;
  isLead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const LeadCaptureSchema = new Schema<ILeadCapture>(
  {
    name: { type: String },
    projectType: { type: String },
    timeline: { type: String },
    contactInfo: { type: String },
  },
  { _id: false }
);

const ChatSessionSchema = new Schema<IChatSession>(
  {
    sessionId: { type: String, required: true, unique: true },
    messages: [MessageSchema],
    leadCapture: LeadCaptureSchema,
    isLead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.ChatSession || mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
