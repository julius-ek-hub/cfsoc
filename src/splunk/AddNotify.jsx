import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";

import Form from "../common/utils/form/controlled/Form";
import TextField from "../common/utils/form/controlled/TextField";
import SubmitButton from "../common/utils/form/controlled/SubmitButton";

const AddNotify = () => {
  return (
    <Box borderLeft={(t) => `1px solid ${t.palette.divider}`} pl={2}>
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
        <Box width={300}>
          <Typography variant="h6" mb={2}>
            Add Telephone:
          </Typography>
          <TextField
            name="owner"
            label="Telephone"
            size="small"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+971</InputAdornment>
              ),
            }}
          />
          <Box>
            <SubmitButton variant="contained" sx={{ mt: 2 }}>
              Add
            </SubmitButton>
          </Box>
        </Box>
      </Form>
    </Box>
  );
};

export default AddNotify;
