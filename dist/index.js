"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const All_1 = __importDefault(require("./models/All"));
const app = (0, express_1.default)();
mongoose_1.default.connect("mongodb://localhost:27017/auction").then(() => {
    console.log("db connected");
});
app.post("/admin", (req, res) => {
    All_1.default.find()
        .then((data) => {
        if (data.length === 0) {
            res.status(404).json({ message: "No data found" });
        }
        else {
            res.json(data);
        }
    })
        .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    });
});
app.listen(5000);
