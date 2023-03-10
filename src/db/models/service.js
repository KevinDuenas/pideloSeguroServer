import { Schema, model } from "mongoose";
import { states } from "@config/constants/common";
import { serviceTypes } from "@config/constants/service";
import mongooseDelete from "mongoose-delete";

const ServiceSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    country: { type: String, default: "MX", required: true },
    state: { type: String, required: true, enum: Object.keys(states) },
    maxPassengers: {
      type: Number,
      required: false,
    },
    maxVolumetric: { type: Number },
    instructions: { type: String },
    active: { type: Boolean, default: false, required: true },
    vehiclesAllowed: [{ type: String }],
    dayRate: {
      required: true,
      type: {
        platformFee: { type: Number, required: true },
        startHour: { type: String, required: true },
        endHour: { type: String, required: true },
        pricePerKilometer: { type: Number, required: true },
        pricePerMinute: { type: Number, required: true },
        initialPrice: { type: Number, required: true },
      },
    },
    nightRate: {
      required: true,
      type: {
        platformFee: { type: Number, required: true },
        startHour: { type: String, required: true },
        endHour: { type: String, required: true },
        pricePerKilometer: { type: Number, required: true },
        pricePerMinute: { type: Number, required: true },
        initialPrice: { type: Number, required: true },
      },
    },
    serviceType: {
      type: String,
      required: true,
      enum: Object.keys(serviceTypes),
    },
  },
  { timestamps: true }
);

ServiceSchema.plugin(mongooseDelete);

export default model("Servcie", ServiceSchema);
