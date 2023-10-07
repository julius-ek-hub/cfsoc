require("dotenv").config();

const fileUpload = require("express-fileupload");
const express = require("express");
const path = require("path");

const cors = require("./mware/cors");
const db = require("./mware/db");
const auth = require("./auth");
const ucm = require("./ucm");

const schedules = require("./schedules");
const apps = require("./apps");

const app = express();

app.use(express.static(path.join(__dirname, "view")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "1mb" }));
app.use(fileUpload());
app.use(cors);
app.use(db);
app.use("/api/schedules", schedules);
app.use("/auth", auth);
app.use("/ucm", ucm);
app.use("/apps", apps);

app.get("/*", (req, res) =>
  res.sendFile(path.join(__dirname, "view", "index.html"))
);

const PORT = process.env.PORT || 4999;

app.listen(PORT, () => console.log(`Listening in port ${PORT}`));
