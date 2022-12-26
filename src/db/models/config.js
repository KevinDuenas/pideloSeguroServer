import { Schema, model } from "mongoose";

const ConfigSchema = new Schema({
  driverDocuments: [
    {
      name: { type: String },
      description: { type: String },
      formatsAccepted: [{ type: String }],
      required: { type: Boolean, required: true, default: false },
      active: { type: Boolean, required: true, default: true },
    },
  ],
});

export default model("Config", ConfigSchema);
