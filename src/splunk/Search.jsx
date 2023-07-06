import { useEffect } from "react";

import { useSearchParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Form from "../common/utils/form/controlled/Form";
import TextField from "../common/utils/form/controlled/TextField";
import SubmitButton from "../common/utils/form/controlled/SubmitButton";
import AutoComplete from "../common/utils/form/controlled/AutoComplete";

import useCommonSettings from "../common/hooks/useSettings";
import useDimension from "../common/hooks/useDimensions";

const Search = () => {
  const { staffs: st } = useCommonSettings();
  const [sp, setSp] = useSearchParams();
  const { up } = useDimension();
  const statuses = ["Aknowledged", "Unacknowledged"];
  const owner = ["unassigned", ...Object.values(st).map((st) => st.name)];

  const security_domain = [
    "Access",
    "Endpoint",
    "Network",
    "Network Security",
    "Thread",
    "Identity",
    "Audit",
    "Health",
  ];
  const titles = [
    "2017___ep-pri__sep-allowed-risk-file___sp1",
    "35063___auth-pri__high-amount-of-files-being-read-from-file-share___sp2",
    "6002___auth-pri___attempted-access-to-disabled/expired-account___sp2",
    "99001_Host_not_Sending_logs_for_more_than_24hrs",
    "99002_VPN_Connection_from_countries_of_interest",
    "MS ATP Alert",
    "Password_Never_Expire",
  ];

  const time = [
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

  const dtime = sp.get("ago");

  const handleSubmit = (values) => {
    const queries = Object.fromEntries(
      Object.entries(values).filter(([k, v]) => v)
    );
    setSp(queries);
  };

  return (
    <Box display="flex" gap={4} flexWrap="wrap">
      <Form
        onSubmit={handleSubmit}
        initialValues={{
          status: sp.getAll("status").filter((sd) => statuses.includes(sd)),
          owner: sp.getAll("owner").filter((sd) => owner.includes(sd)),
          security_domain: sp
            .getAll("security_domain")
            .filter((sd) => security_domain.includes(sd)),
          title: sp.getAll("title").filter((sd) => titles.includes(sd)),
          search: sp.get("search") || "",
          time: dtime && time.includes(dtime) ? dtime : time[0],
        }}
      >
        <Box width={up.md ? "40%" : "100%"} flexGrow={1}>
          <Typography variant="h6">Search Alerts: </Typography>
          <AutoComplete
            name="status"
            options={statuses}
            label="Status"
            size="small"
            limitTags={2}
          />
          <AutoComplete
            name="owner"
            options={owner}
            label="Owner"
            size="small"
            limitTags={2}
          />
          <AutoComplete
            name="security_domain"
            options={security_domain}
            label="security Domain"
            size="small"
            limitTags={2}
          />
        </Box>
        <Box width={up.md ? "50%" : "100%"} flexGrow={1}>
          <AutoComplete
            name="title"
            options={titles}
            label="Title"
            size="small"
            limitTags={2}
          />
          <TextField
            name="search"
            label="Search"
            fullWidth
            margin="dense"
            size="small"
          />
          <AutoComplete
            name="time"
            options={time}
            label="Time"
            size="small"
            multiple={false}
          />
          <SubmitButton variant="contained" sx={{ mt: 2 }}>
            Search
          </SubmitButton>
        </Box>
      </Form>
    </Box>
  );
};

export default Search;
