import { Schema, model } from "mongoose";

const VerificationRequestSchema = new Schema(
  {
    folio: { type: String, required: true, index: true },
    type: { type: String, rquired: true, default: "DRIVER_REQUEST" },
    status: { type: String, rquired: true, default: "REVIEW_PENDING" },
    driver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    reviewedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default model("VerificationRequest", VerificationRequestSchema);
