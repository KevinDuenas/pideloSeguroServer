import { Schema, model } from "mongoose";
import mongooseDelete from "mongoose-delete";

const FolioSchema = new Schema(
  {
    foodDelivery: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

FolioSchema.plugin(mongooseDelete);

export default model("Folio", FolioSchema);
