import express from "express";
import mongoose from "mongoose";
import All from "./models/All";

const app = express();

mongoose.connect("mongodb://localhost:27017/auction").then(() => {
  console.log("db connected");
});

app.post("/admin", (req, res) => {
  All.find()
    .then((data) => {
      if (data.length === 0) {
        res.status(404).json({ message: "No data found" });
      } else {
        res.json(data);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

app.listen(5000);
