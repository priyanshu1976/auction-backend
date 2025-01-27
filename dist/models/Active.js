"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const activeSchema = new mongoose_1.Schema({
    itemName: { type: String, require: true },
    quantity: { type: Number, require: true },
});
const activeModel = mongoose_2.default.model("active", activeSchema);
exports.default = activeModel;
