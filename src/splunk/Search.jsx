import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Form from "../common/utils/form/controlled/Form";
import TextField from "../common/utils/form/controlled/TextField";
import SubmitButton from "../common/utils/form/controlled/SubmitButton";
import AutoComplete from "../common/utils/form/controlled/AutoComplete";

const Search = () => {
  const receipients = ["Aknowledged", "New", "Pending"];
  return (
    <Box display="flex" gap={4} flexWrap="wrap">
      <Form
        onSubmit={console.log}
        initialValues={{
          status: [],
          owner: [],
          security_domain: [],
          title: [],
          search: "",
          ago: [],
        }}
      >
        <Box width={350}>
          <Typography variant="h6">Search Alerts: </Typography>
          <AutoComplete
            name="status"
            options={receipients}
            label="Status"
            size="small"
          />
          <AutoComplete
            name="owner"
            options={receipients}
            label="Owner"
            size="small"
          />
          <AutoComplete
            name="security_domain"
            options={receipients}
            label="security Domain"
            size="small"
          />
        </Box>
        <Box width={350}>
          <AutoComplete
            name="title"
            options={receipients}
            label="Title"
            size="small"
          />
          <TextField
            name="search"
            label="Search"
            fullWidth
            margin="dense"
            size="small"
          />
          <AutoComplete
            name="ago"
            options={receipients}
            label="Title"
            size="small"
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
