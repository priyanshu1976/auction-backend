import express from "express";
import mongoose from "mongoose";
import All from "./models/All";
import activeModel from "./models/Active";
import bodyParser from "body-parser";
import TeamModel from "./models/Team";
import cors from "cors"; // Import CORS middleware

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

mongoose
  .connect(
    "mongodb+srv://priyanshucto:WRfVzfHTFuFOUs6T@cluster0.55utm.mongodb.net/"
  )
  .then(() => {
    console.log("db connected");
  });

app.get("/inventory", (req, res) => {
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

// ! authenticate only admin access
app.post("/admin/active", (req, res) => {
  console.log(req.body);

  const { itemName, itemQuantity } = req.body;

  // Convert itemQuantity to a number and validate it
  const quantity = Number(itemQuantity);
  if (isNaN(quantity)) {
    res
      .status(400)
      .json({ message: "Invalid itemQuantity; must be a numeric value" });
  }

  console.log(itemName, quantity);
  activeModel.collection.drop();
  activeModel
    .create({ itemName: itemName, quantity: quantity }) // Save numeric quantity
    .then(() => {
      console.log("Item added to the active array");

      All.updateOne(
        { itemName: itemName },
        { $inc: { quantity: -quantity } } // Proper numeric decrement
      )
        .then(() => {
          console.log(itemName, quantity);
          console.log("Item quantity updated in the All collection");
          res.status(200).json({
            message: "Item successfully moved to active and quantity updated",
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({
            message: "Failed to update item quantity in the All collection",
          });
        });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: "Failed to add item to the active array" });
    });
});

// ! authenticate only admin access
app.post("/admin/change", (req, res) => {
  const { teamName, itemName, itemQuantity, amount } = req.body;

  // Convert itemQuantity to a number and validate it
  const quantity = Number(itemQuantity);
  if (isNaN(quantity)) {
    res
      .status(400)
      .json({ message: "Invalid itemQuantity; must be a numeric value" });
    return; // Ensure to return after sending a response
  }

  console.log(teamName, itemName, quantity);

  // Update the team's inventory by adding the new item and adjust balance
  TeamModel.findOneAndUpdate(
    { teamName: teamName },
    {
      $push: { inventory: { itemName: itemName, itemQuantity: quantity } },
      $inc: { balance: -amount }, // Adjust balance by subtracting the amount
    },
    { new: true } // Return the updated document
  )
    .then((updatedTeam) => {
      if (!updatedTeam) {
        res.status(404).json({ message: "Team not found" });
      } else {
        res.status(200).json({
          message: "Item added to team inventory and balance updated",
          inventory: updatedTeam.inventory,
          balance: updatedTeam.balance,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: "Failed to update team inventory and balance" });
    });
});

app.post("/team/signin", (req, res) => {
  const { teamName, password } = req.body;

  // Check if team exists and password matches
  TeamModel.findOne({ teamName: teamName })
    .then((team) => {
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      if (team.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
      }
      res.status(200).json({ message: "Authentication successful" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

app.post("/team/signup", (req, res) => {
  const { teamName, password } = req.body;

  // Check if team exists
  TeamModel.findOne({ teamName: teamName })
    .then((team) => {
      if (team) {
        return res.status(409).json({ message: "Team already exists" });
      }

      // Create a new team
      const newTeam = new TeamModel({
        teamName: teamName,
        password: password,
        balance: 5000,
        inventory: [],
      });

      // Save the new team
      newTeam
        .save()
        .then(() => {
          res.status(201).json({ message: "Team created successfully" });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "Failed to create team" });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

app.get("/team/inventory/:teamName", (req, res) => {
  const teamName = req.params.teamName;
  TeamModel.findOne({ teamName: teamName })
    .then((team) => {
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res
        .status(200)
        .json({ inventory: team.inventory, balance: team.balance });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

app.get("/active", (req, res) => {
  activeModel
    .find()
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
