export const alert_titles = [
  { label: "Time", minWidth: 100, id: "_time" },
  {
    label: "Source IP",
    id: "source_ip",
    minWidth: 60,
    align: "right",
  },
  {
    label: "Title",
    id: "title",
    minWidth: 200,
    align: "right",
  },
  {
    label: "Security Domain",
    minWidth: 40,
    align: "right",
    id: "security_domain",
  },
  {
    label: "Urgency",
    minWidth: 20,
    align: "right",
    id: "urgency",
  },
  {
    label: "Status",
    minWidth: 20,
    align: "right",
    id: "status",
  },
  {
    label: "Owner",
    minWidth: 20,
    align: "right",
    id: "owner",
  },
];

export function getBrowserType(useragent) {
  const test = (regexp) => {
    return regexp.test(useragent);
  };

  const pf = " - " + useragent.split("__")[2];

  if (test(/opr\//i) || !!window.opr) {
    return "Opera" + pf;
  } else if (test(/edg/i)) {
    return "Microsoft Edge" + pf;
  } else if (test(/chrome|chromium|crios/i)) {
    return "Google Chrome" + pf;
  } else if (test(/firefox|fxios/i)) {
    return "Mozilla Firefox" + pf;
  } else if (test(/safari/i)) {
    return "Apple Safari" + pf;
  } else if (test(/trident/i)) {
    return "Microsoft Internet Explorer" + pf;
  } else if (test(/ucbrowser/i)) {
    return "UC Browser" + pf;
  } else if (test(/samsungbrowser/i)) {
    return "Samsung Browser" + pf;
  } else {
    return "Unknown browser" + pf;
  }
}

export const search_security_domains = [
  "Access",
  "Endpoint",
  "Network",
  "Network Security",
  "Thread",
  "Identity",
  "Audit",
  "Health",
];
export const search_titles = [
  "2017___ep-pri__sep-allowed-risk-file___sp1",
  "35063___auth-pri__high-amount-of-files-being-read-from-file-share___sp2",
  "6002___auth-pri___attempted-access-to-disabled/expired-account___sp2",
  "99001_Host_not_Sending_logs_for_more_than_24hrs",
  "99002_VPN_Connection_from_countries_of_interest",
  "MS ATP Alert",
  "Password_Never_Expire",
];

export const search_times = [
  "Last 15 mins",
  "Last 30 mins",
  "Last 4 hours",
  "Last 24 hours",
  "This week",
  "This month",
  "Last 30 days",
  "This year",
  "All time",
];
