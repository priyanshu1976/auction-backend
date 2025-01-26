import mongoose, { Schema, model } from "mongoose";

const dataSchema = new Schema({
  itemName: { type: String, require: true },
  quantity: { type: String, require: true },
});

const dataModel = mongoose.model("avaliable", dataSchema);
export default dataModel;
