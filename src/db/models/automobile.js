import { Schema, model } from "mongoose";
import mongooseDelete from "mongoose-delete";

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

AutomobileSchema.plugin(mongooseDelete);

export default model("Automobile", AutomobileSchema);
