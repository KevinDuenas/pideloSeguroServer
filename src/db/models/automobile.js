import { Schema, model } from "mongoose";

const AutomobileSchema = new Schema(
  {
    driver: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    plates: { type: String, required: true },
    color: { type: String, required: true },
    verificationStatus: { type: String, default: "MISSING" },
    type: { type: String, required: true, default: "CAR" },
  },
  { timestamps: true }
);

export default model("Automobile", AutomobileSchema);
