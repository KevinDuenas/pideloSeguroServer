import { Schema, model } from "mongoose";
import {
  paymentStatus,
  paymentMethod,
  paymentType,
} from "@config/constants/payment";
import mongooseDelete from "mongoose-delete";

const PaymentSchema = new Schema(
  {
    stripePaymentIntentId: { type: String },
    amount: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    status: {
      type: String,
      required: true,
      enum: Object.keys(paymentStatus),
    },
    type: {
      type: String,
      required: true,
      enum: Object.keys(paymentType),
    },
    method: {
      type: String,
      required: true,
      enum: Object.keys(paymentMethod),
    },
  },
  { timestamps: true }
);

PaymentSchema.plugin(mongooseDelete);

export default model("Payment", PaymentSchema);
