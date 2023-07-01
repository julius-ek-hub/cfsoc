import { useState } from "react";

import TextFieldMui from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import AttachmentIcon from "@mui/icons-material/Attachment";

import WithSuggested from "./WithSuggesters";
import Dialogue from "../../../common/utils/Dialogue";
import Form from "../../../common/utils/form/controlled/Form";
import TextField from "../../../common/utils/form/controlled/TextField";
import SubmitButton from "../../../common/utils/form/controlled/SubmitButton";
import AutoComplete from "../../../common/utils/form/controlled/AutoComplete";

import * as Yup from "yup";

import useActiveSchedule from "../../hooks/useSchedules/active";
import useCommonSettings from "../../../common/hooks/useSettings";

import { schedule_date_range_ui } from "../../utils/utils";

const schema = Yup.object({
  receipients: Yup.array().min(1, "Atleast 1 receipient is required"),
  cc: Yup.string(),
  subject: Yup.string(),
  body: Yup.string(),
});

const EmailSchedule = () => {
  const { active, emailSchedule } = useActiveSchedule();
  const { uname, user, staffs } = useCommonSettings();

  const receipients = Object.keys(staffs);
  const [bys, setBys] = useState(null);

  const d = schedule_date_range_ui(active.from, active.to);
  const subject = `SOC Schedule (${d[0]} - ${d[1]})`;

  const handleChose = () => setBys(null);

  const onDone = async (values) => {
    await emailSchedule({
      ...values,
      bys,
      from: active.from,
      to: active.to,
      senderName: user.name,
      replyTo: user.email,
    });
    setBys(null);
  };

  return (
    <>
      <WithSuggested
        Icon={AttachEmailIcon}
        onChoose={setBys}
        title="Email Schedule"
        okText="Next"
      />
      <Dialogue open={Boolean(bys)} title="Add a message">
        <Form
          validationSchema={schema}
          initialValues={{
            subject,
            body: `Dear Team, \n\nPFA.\n\nRegards.\n${staffs[uname].name}\n${staffs[uname].position}`,
            receipients: receipients.filter((s) => s !== uname),
            cc: "",
          }}
          onSubmit={onDone}
        >
          <AutoComplete name="receipients" options={receipients} label="To" />
          <TextField
            name="cc"
            fullWidth
            margin="dense"
            multiline
            minRows={3}
            maxRows={3}
            placeholder="Eg. name1@domain1.ext1,name2@domain2.ext2,name3@domain3.ext3"
            label="CC"
            helperText="Emails separated by semi-colon"
          />
          <TextField name="subject" fullWidth margin="dense" label="Subject" />
          <TextFieldMui
            value={subject + ".xlsx"}
            label="Attachment"
            margin="dense"
            size="small"
            disabled
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachmentIcon color="disabled" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="body"
            label="Message"
            fullWidth
            margin="dense"
            multiline
            minRows={10}
            maxRows={15}
          />
          <Box sx={{ mt: 2 }}>
            <SubmitButton size="large" variant="contained">
              Send
            </SubmitButton>
            <Button
              type="button"
              size="large"
              sx={{ ml: 2 }}
              onClick={handleChose}
            >
              Cencel
            </Button>
          </Box>
        </Form>
      </Dialogue>
    </>
  );
};

export default EmailSchedule;
