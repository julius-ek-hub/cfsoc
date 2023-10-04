const express = require("express");

const try_catch = require("../mware/try_catch");
const {
  getSheets,
  newSheet,
  updateSheet,
  updateStructure,
  updateSheetLocation,
  deleteSheet,
} = require("./routes/sheets");
const download = require("./routes/download");
const {
  getContent,
  addContent,
  editContent,
  deleteContent,
} = require("./routes/content");
const { overRide } = require("./routes/override");
const extract = require("./routes/extract");
const fetch_site = require("./routes/fetch_site");

const Router = express.Router();

Router.post("/override", try_catch(overRide));
Router.get("/data", try_catch(getContent));
Router.post("/data", try_catch(addContent));
Router.patch("/data", try_catch(editContent));
Router.delete("/data", try_catch(deleteContent));
Router.post("/download", try_catch(download));

Router.get("/sheets", try_catch(getSheets));
Router.post("/sheets", try_catch(newSheet));
Router.patch("/sheets", try_catch(updateSheet));
Router.patch("/update-structure", try_catch(updateStructure));
Router.patch("/sheets/location", try_catch(updateSheetLocation));
Router.delete("/sheets/:key", try_catch(deleteSheet));
Router.post("/extract", try_catch(extract));
Router.get("/html", try_catch(fetch_site));

module.exports = Router;
