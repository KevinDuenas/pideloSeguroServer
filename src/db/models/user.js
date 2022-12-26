import { Schema, model } from "mongoose";
import mongooseDelete from "mongoose-delete";

const UserSchema = new Schema(
  {
    firstName: { type: String, required: false, index: true },
    firstLastName: { type: String, required: false, index: true },
    secondLastName: { type: String, required: false, index: true },
    phoneNumber: { type: String, required: false },
    dob: { type: Date, required: false },
    profileImg: { type: String },
    email: { type: String, required: false, unique: true },
    verificationStatus: { type: String, default: "DOCUMENTS_PENDING" },
    address: {
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
    documents: [
      {
        document: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Document",
        },
        name: { type: String, required: true },
        uri: { type: String, required: true },
        type: { type: String, required: true },
        status: { type: String },
        rejectedReason: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(mongooseDelete);

export default model("User", UserSchema);
