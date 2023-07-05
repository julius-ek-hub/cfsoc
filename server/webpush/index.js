const express = require("express");

const try_catch = require("../mware/try_catch");
const { subscribe } = require("./router");

const Router = express.Router();

Router.post("/subscribe", try_catch(subscribe));

module.exports = Router;
