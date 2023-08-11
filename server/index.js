require("dotenv").config();

const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const path = require("path");

const cors = require("./mware/cors");
const db = require("./mware/db");
const auth = require("./auth");

const schedules = require("./schedules");
const expo = require("./expo");

const app = express();

app.use(express.static(path.join(__dirname, "view")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(cors);
app.use(db);
app.use("/api/schedules", schedules);
app.use("/expocitydubai", expo);
app.use("/auth", auth);

app.get("/*", (req, res) =>  res.sendFile(path.join(__dirname, "view", "index.html"))
);

const PORT = process.env.PORT || 4999;

app.listen(PORT, () => console.log(`Listing in port ${PORT}`));