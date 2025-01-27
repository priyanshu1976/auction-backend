"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const TeamSchema = new mongoose_2.Schema({
    teamName: { type: String, require: true },
    password: { type: String, require: true },
    balance: { type: Number, require: true },
    inventory: { type: Array, require: true },
});
const TeamModel = mongoose_1.default.model("Team", TeamSchema);
exports.default = TeamModel;
