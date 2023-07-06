const express = require("express");
const checkUnacknowledgedAlerts = require("./utils/notify");

const try_catch = require("../mware/try_catch");
const {
  getAlerts,
  saveAlert,
  deleteAlert,
  //   updateAlert,
  getUnreceivedAlerts,
} = require("./routes/alerts");
const {
  getNotify,
  deleteNotify,
  saveNotify,
  updateNotify,
} = require("./routes/notify");

const Router = express.Router();

Router.post("/webhook/splunk-alert", try_catch(saveAlert));
Router.get("/api/splunk-alerts", try_catch(getAlerts));
Router.get("/api/splunk-alerts/unreceived", try_catch(getUnreceivedAlerts));
Router.get("/api/splunk-alerts/notify", try_catch(getNotify));
Router.post("/api/splunk-alerts/notify", try_catch(saveNotify));
Router.patch("/api/splunk-alerts/notify", try_catch(updateNotify));
Router.delete("/api/splunk-alerts/notify/:__id", try_catch(deleteNotify));
Router.delete("/api/splunk-alerts/:__id", try_catch(deleteAlert));

checkUnacknowledgedAlerts();

module.exports = Router;
