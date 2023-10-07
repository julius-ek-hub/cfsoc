const express = require("express");

const login = require("./login");
const createPass = require("./create");
const { verifyToken, verifyUser } = require("./verify");
const {
  addStaff,
  deleteStaff,
  getStaffs,
  updateStaff,
  getUser,
} = require("./router");
const try_catch = require("../mware/try_catch");
const { update } = require("../utils/update");

const Router = express.Router();

Router.post("/login", try_catch(login));
Router.post("/verify-user", try_catch(verifyUser));
Router.post("/create-pass", try_catch(createPass));
Router.get("/verify-token", try_catch(verifyToken));
Router.get("/staffs", try_catch(getStaffs));
Router.get("/user", try_catch(getUser));
Router.get("/update-ui", try_catch(update));
Router.post("/staffs", try_catch(addStaff));
Router.patch("/staffs", try_catch(updateStaff));
Router.delete("/staffs", try_catch(deleteStaff));

module.exports = Router;
