import { Schema, model } from "mongoose";
import mongooseDelete from "mongoose-delete";
import { overallRoles } from "@config/constants/user";

const UserSchema = new Schema(
  {
    firstName: { type: String, required: false, index: true },
    firstLastName: { type: String, required: false, index: true },
    password: { type: String, required: true },
    secondLastName: { type: String, required: false, index: true },
    phoneNumber: { type: String, required: false },
    dob: { type: Date, required: false },
    profileImg: { type: String },
    email: { type: String, required: true, unique: true },
    verificationStatus: { type: String, default: "DOCUMENTS_PENDING" },
    pushNotificationToken: { type: String },
    balance: { type: Number, required: true, default: 0.0 },
    shares: { type: Number },
    overallRole: {
      type: String,
      required: true,
      enum: Object.keys(overallRoles),
      default: "DRIVER",
    },
    address: {
      type: {
        formattedAddress: { type: String },
        extraInfo: { type: String },
        // Setup based on https://docs.mongodb.com/manual/reference/geojson/
        geolocation: {
          type: {
            type: String,
            default: "Point",
            enum: ["Point"],
          },
          // [lng, lat]
          coordinates: { type: [Number] },
        },
      },
      required: false,
    },
    documents: [
      {
        name: { type: String, required: true },
        uri: { type: String, required: true },
        type: { type: String, required: true },
        status: { type: String, required: true, default: "PENDING" },
        rejectedReason: { type: String },
      },
    ],
    stripeCustomerId: { type: String },
    passwordRecoveryToken: { type: String },
    validateToken: { type: String },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(mongooseDelete);

export default model("User", UserSchema);
