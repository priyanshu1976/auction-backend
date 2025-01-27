import mongoose from "mongoose";
import { Schema } from "mongoose";

const TeamSchema = new Schema({
  teamName: { type: String, require: true },
  password: { type: String, require: true },
  balance: { type: Number, require: true },
  inventory: { type: Array, require: true },
});

const TeamModel = mongoose.model("Team", TeamSchema);

export default TeamModel;
