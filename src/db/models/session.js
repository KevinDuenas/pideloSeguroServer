import { Schema, model } from 'mongoose';

const SessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    refreshToken: { type: String, required: true, index: true },
    active: { type: Boolean, default: true },
    browser: { type: String },
    version: { type: String },
    os: { type: String },
    platform: { type: String },
  },
  { timestamps: true }
);

export default model('Session', SessionSchema);
