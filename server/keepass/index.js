const express = require("express");

const { getDBContent, getDBs } = require("./get");
const upload = require("./upload");

const try_catch = require("../mware/try_catch");
const { addEntry, addGroup } = require("./post");
const {
  updateEntry,
  updateGroup,
  restoreGroup,
  restoreEntry,
  restoreRB,
  move,
} = require("./update");
const { removeEntry, removeGroup, emptyRB } = require("./remove");

const deleteDB = require("./deleteDB");
const download = require("./download");

const Router = express.Router();

Router.get("/dbs", try_catch(getDBs));
Router.post("/content", try_catch(getDBContent));
Router.post("/new-db", try_catch(upload));
Router.post("/entry", try_catch(addEntry));
Router.post("/group", try_catch(addGroup));
Router.patch("/group", try_catch(updateGroup));
Router.patch("/restore/group", try_catch(restoreGroup));
Router.patch("/restore/entry", try_catch(restoreEntry));
Router.patch("/restore-rb", try_catch(restoreRB));
Router.delete("/empty-rb", try_catch(emptyRB));
Router.patch("/move", try_catch(move));
Router.patch("/entry", try_catch(updateEntry));
Router.delete("/entry", try_catch(removeEntry));
Router.delete("/group", try_catch(removeGroup));
Router.delete("/db", try_catch(deleteDB));
Router.get("/download", try_catch(download));

module.exports = Router;
