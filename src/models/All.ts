import mongoose, { Schema } from "mongoose";

const dataSchema = new Schema({
  itemName: { type: String, require: true },
  quantity: { type: Number, require: true },
});

const dataModel = mongoose.model("avaliable", dataSchema);
export default dataModel;
