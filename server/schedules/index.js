const express = require("express");

const anySchedule = require("./routes/any");
const getNext = require("./routes/next");
const getCurrent = require("./routes/current");
const likeHandler = require("./routes/like");
const lockHandler = require("./routes/lock");
const approve = require("./routes/approve");
const startHandler = require("./routes/start");
const copy = require("./routes/copy");
const download = require("./routes/download");
const email = require("./routes/email");
const try_catch = require("../mware/try_catch");
const { updateSuggestion, deleteSuggetion } = require("./routes/suggestions");
const {
  getDates,
  getShifts,
  saveShifts,
  getMaxDays,
  setMaxDays,
} = require("./routes/dates");
const { getStatuses, saveStatus, updateStatus } = require("./routes/statuses");

const Router = express.Router();

Router.get("/dates", try_catch(getDates));
Router.get("/download", try_catch(download));
Router.post("/email", try_catch(email));

Router.get("/shifts", try_catch(getShifts));
Router.post("/shifts", try_catch(saveShifts));

Router.get("/statuses", try_catch(getStatuses));
Router.post("/statuses", try_catch(saveStatus));
Router.patch("/statuses", try_catch(updateStatus));

Router.get("/max_days", try_catch(getMaxDays));
Router.post("/max_days", try_catch(setMaxDays));

Router.post("/suggestions", try_catch(updateSuggestion));
Router.delete("/suggestions", try_catch(deleteSuggetion));

Router.get("/generate", try_catch(copy));
Router.post("/start", try_catch(startHandler));
Router.post("/like", try_catch(likeHandler));
Router.post("/lock", try_catch(lockHandler));
Router.post("/approve", try_catch(approve));
Router.get("/current", try_catch(getCurrent));
Router.post("/next", try_catch(getNext));
Router.get("/:range", try_catch(anySchedule));

module.exports = Router;
