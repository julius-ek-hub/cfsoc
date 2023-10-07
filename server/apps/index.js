const mongoose = require("mongoose");
const express = require("express");
const try_catch = require("../mware/try_catch");

const Router = express.Router();

const conn = mongoose.connection.useDb("cfsoc").collection("apps");

Router.get(
  "/",
  try_catch(async (req, res) => {
    const apps = await conn.find().toArray();
    res.json(apps);
  })
);
Router.post(
  "/",
  try_catch(async (req, res) => {
    const doc = req.body;
    const save = await conn.insertOne(doc);
    res.json(save);
  })
);
Router.delete(
  "/",
  try_catch(async (req, res) => {
    await conn.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(req.query._id),
    });
    res.json({});
  })
);
Router.patch(
  "/",
  try_catch(async (req, res) => {
    await conn.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.query._id),
      },
      { $set: req.body }
    );
    res.json({});
  })
);

module.exports = Router;
