const express = require("express");
const { checkUnacknowledgedAlerts } = require("./utils/notify");

const try_catch = require("../mware/try_catch");
const {
  getAlerts,
  saveAlert,
  updateAlert,
  getUnreceivedAlerts,
} = require("./routes/alerts");

const {
  getAccount,
  enableNotify,
  subscribeForPush,
  updateNotify,
} = require("./routes/accounts");

const Router = express.Router();

Router.post("/webhook/splunk-alert", try_catch(saveAlert));
Router.get("/api/splunk-alerts", try_catch(getAlerts));
Router.get("/api/splunk-alerts/unreceived", try_catch(getUnreceivedAlerts));

Router.post("/api/splunk-alerts/push-subscribe", try_catch(subscribeForPush));
Router.patch("/api/splunk-alerts/enable-notify", try_catch(enableNotify));
Router.get("/api/splunk-alerts/account", try_catch(getAccount));
Router.patch("/api/splunk-alerts/notify", try_catch(updateNotify));

Router.patch("/api/splunk-alerts/", try_catch(updateAlert));

checkUnacknowledgedAlerts();

module.exports = Router;
