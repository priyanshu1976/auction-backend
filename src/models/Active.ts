import { Schema } from "mongoose";
import mongoose from "mongoose";

const activeSchema = new Schema({
  itemName: { type: String, require: true },
  quantity: { type: Number, require: true },
});

const activeModel = mongoose.model("active", activeSchema);

export default activeModel;
