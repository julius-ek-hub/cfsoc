const express = require("express");

const login = require("./login");
const createPass = require("./create");
const { verifyToken, verifyUser } = require("./verify");

const Router = express.Router();

Router.post("/login", login);
Router.post("/verify-user", verifyUser);
Router.post("/create-pass", createPass);
Router.get("/verify-token", verifyToken);

module.exports = Router;
