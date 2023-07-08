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
import useToasts from "../common/hooks/useToast";

import { search_security_domains, search_titles, search_times } from "./utils";

const Search = () => {
  const { staffs: st } = useCommonSettings();
  const [sp, setSp] = useSearchParams();
  const { up } = useDimension();
  const { push } = useToasts();
  const statuses = ["Aknowledged", "Unacknowledged"];
  const owner = ["unassigned", ...Object.values(st).map((st) => st.name)];

  const dtime = sp.get("ago");

  const handleSubmit = (values) => {
    const queries = Object.fromEntries(
      Object.entries(values).filter(([k, v]) => v)
    );
    setSp(queries);
    push(queries);
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
            .filter((sd) => search_security_domains.includes(sd)),
          title: sp.getAll("title").filter((sd) => search_titles.includes(sd)),
          search: sp.get("search") || "",
          time: dtime && search_times.includes(dtime) ? dtime : search_times[3],
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
            options={search_security_domains}
            label="security Domain"
            size="small"
            limitTags={2}
          />
        </Box>
        <Box width={up.md ? "50%" : "100%"} flexGrow={1}>
          <AutoComplete
            name="title"
            options={search_titles}
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
            options={search_times}
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
