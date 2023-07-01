import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Form from "../common/utils/form/controlled/Form";
import SubmitButton from "../common/utils/form/controlled/SubmitButton";
import AutoComplete from "../common/utils/form/controlled/AutoComplete";

import useCommonSettings from "../common/hooks/useSettings";

const Notify = () => {
  const { staffs: st } = useCommonSettings();
  const staffs = Object.keys(st);
  const telephones = [];

  return (
    <Box borderLeft={(t) => `1px solid ${t.palette.divider}`} pl={2}>
      <Form
        onSubmit={console.log}
        initialValues={{
          staffs: [],
          telephones: [],
        }}
      >
        <Box width={350}>
          <Typography variant="h6">Send notifications to: </Typography>
          <AutoComplete
            name="staffs"
            options={staffs}
            label="Staffs"
            size="small"
          />
          <AutoComplete
            name="telephones"
            options={telephones}
            label="Telephones"
            size="small"
          />
          <SubmitButton variant="contained" sx={{ mt: 2 }}>
            Save
          </SubmitButton>
        </Box>
      </Form>
    </Box>
  );
};

export default Notify;
