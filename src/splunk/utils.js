export const alert_titles = [
  { label: "Time", minWidth: 100, id: "time" },
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

export function createData(
  time,
  source_ip,
  title,
  security_domain,
  urgency,
  status,
  owner
) {
  return { time, source_ip, title, security_domain, urgency, status, owner };
}

export const rows = [
  createData("India", "IN", 1324171354, 3287263, "India", "IN", 1324171354),
  createData("India", "IN", 1324171354, 3287263, "India", "IN", 1324171354),
  createData("India", "IN", 1324171354, 3287263, "India", "IN", 1324171354),
  createData("India", "IN", 1324171354, 3287263, "India", "IN", 1324171354),
  createData("India", "IN", 1324171354, 3287263, "India", "IN", 1324171354),
  createData("India", "IN", 1324171354, 3287263, "India", "IN", 1324171354),
  createData("India", "IN", 1324171354, 3287263, "India", "IN", 1324171354),
  createData("India", "IN", 1324171354, 3287263, "India", "IN", 1324171354),
  createData("India", "IN", 1324171354, 3287263, "India", "IN", 1324171354),
  createData("India", "IN", 1324171354, 3287263, "India", "IN", 1324171354),
  createData("India", "IN", 1324171354, 3287263, "India", "IN", 1324171354),
  createData("India", "IN", 1324171354, 3287263, "India", "IN", 1324171354),
  createData("India", "IN", 1324171354, 3287263, "India", "IN", 1324171354),
  createData("India", "IN", 1324171354, 3287263, "India", "IN", 1324171354),
  createData("India", "IN", 1324171354, 3287263, "India", "IN", 1324171354),
];
