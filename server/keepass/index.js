const express = require("express");

const { getDBContent, getDBs } = require("./get");
const upload = require("./upload");

const try_catch = require("../mware/try_catch");

const Router = express.Router();

Router.get("/dbs", try_catch(getDBs));
Router.post("/content", try_catch(getDBContent));
Router.post("/new-db", try_catch(upload));

module.exports = Router;
