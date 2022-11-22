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
    verificationStatus: { type: String, default: "DOCUMENTS_PENDING" },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(mongooseDelete);

export default model("User", UserSchema);
