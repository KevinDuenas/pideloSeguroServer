import { Schema, model } from "mongoose";

const AutomobileSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    brand: { type: String },
    model: { type: String },
    plates: { type: String },
    color: { type: String },
    verificationStatus: { type: String, default: "DOCUMENTS_PENDING" },
    type: { type: String, default: "DOCUMENTS_PENDING" },
  },
  { timestamps: true }
);

export default model("Automobile", AutomobileSchema);
