import { Schema, model } from "mongoose";
import mongooseDelete from "mongoose-delete";

const TripSchema = new Schema(
  {
    folio: { type: String, required: false },
    driver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    programmedDate: { type: Date },
    status: { type: String, required: false, default: "DRIVER_PENDING" },
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
