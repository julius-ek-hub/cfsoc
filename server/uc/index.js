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
const {
  getUCTable,
  addContent,
  editContent,
  deleteContent,
  getFilters,
  addFilter,
  removeFilter,
} = require("./routes/content");
const { overRide } = require("./routes/override");
const fetch_site = require("./routes/fetch_site");
const download = require("./routes/download");

const Router = express.Router();

Router.post("/override", try_catch(overRide));
Router.get("/uc_table", try_catch(getUCTable));
Router.get("/filters", try_catch(getFilters));
Router.post("/filters", try_catch(addFilter));
Router.delete("/filters", try_catch(removeFilter));
Router.post("/data", try_catch(addContent));
Router.post("/download", try_catch(download));
Router.patch("/data", try_catch(editContent));
Router.delete("/data", try_catch(deleteContent));

Router.get("/sheets", try_catch(getSheets));
Router.post("/sheets", try_catch(newSheet));
Router.patch("/sheets", try_catch(updateSheet));
Router.patch("/update-structure", try_catch(updateStructure));
Router.patch("/sheets/location", try_catch(updateSheetLocation));
Router.delete("/sheets/:key", try_catch(deleteSheet));
Router.get("/html", try_catch(fetch_site));

module.exports = Router;
