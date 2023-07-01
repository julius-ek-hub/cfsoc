require("dotenv").config();

const express = require("express");
const path = require("path");

const schedules = require("./schedules");
const expo = require("./expo");

const app = express();

app.use(express.static(path.join(__dirname, "view")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/schedules", schedules);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "view", "index.html"));
});

app.use("/api/expo", expo);

const PORT = process.env.PORT || 4999;

app.listen(PORT, () => console.log(`Listing in port ${PORT}`));
