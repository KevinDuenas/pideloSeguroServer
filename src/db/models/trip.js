import { Schema, model } from "mongoose";
import mongooseDelete from "mongoose-delete";
import { tripStatus } from "@config/constants/trip";

const TripSchema = new Schema(
  {
    folio: { type: String, required: false },
    driver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    programmedDate: { type: Date },
    status: {
      type: String,
      required: true,
      default: "DRIVER_PENDING",
      enum: Object.keys(tripStatus),
    },
    tripStartedAt: { type: Date, required: false },
    tripEndedAt: { type: Date, required: false },
    destinations: [
      {
        priority: { type: Number, required: true },
        formattedAddress: { type: String, required: true },
        extraInfo: { type: String },
        // Setup based on https://docs.mongodb.com/manual/reference/geojson/
        geolocation: {
          type: {
            type: String,
            default: "Point",
            enum: ["Point"],
            required: true,
          },
          // [lng, lat]
          coordinates: { type: [Number], required: true },
        },
      },
    ],
    tripType: { type: String },
    onerpInfo: {
      type: {
        storeId: {
          type: Schema.Types.ObjectId,
          required: true,
          index: true,
        },
        userId: {
          type: Schema.Types.ObjectId,
          required: true,
          index: true,
        },
        ticketId: {
          type: Schema.Types.ObjectId,
          required: true,
          index: true,
        },
        ticketTotal: { type: Number, required: true },
        clientName: { type: String },
        clientPhone: { type: String },
      },
      required: false,
    },
    meters: { type: Number, required: true },
    cost: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

TripSchema.plugin(mongooseDelete);

export default model("Trip", TripSchema);
