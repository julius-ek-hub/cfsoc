import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Form from "../common/utils/form/controlled/Form";
import SubmitButton from "../common/utils/form/controlled/SubmitButton";
import AutoComplete from "../common/utils/form/controlled/AutoComplete";

import { useFormikContext } from "formik";

import useAlerts from "./hooks/useAlerts";
import useLoading from "../common/hooks/useLoading";

import Loading from "./Loading";
import { useEffect } from "react";
import { FormLabel } from "@mui/material";

const SaveButton = () => {
  const { notify } = useAlerts();
  const emails = notify.filter((n) => n.type === "email");
  const sms = notify.filter((n) => n.type === "sms");

  const activeSMS = sms.filter((s) => s.active).map((s) => s.contact);
  const activeEmails = emails.filter((e) => e.active).map((s) => s.contact);

  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    setFieldValue("sms", activeSMS);
    setFieldValue("emails", activeEmails);
  }, [notify]);

  const sameEmails =
    values.emails.sort().join("") === activeEmails.sort().join("");
  const sameSMS = values.sms.sort().join("") === activeSMS.sort().join("");

  if (sameEmails && sameSMS) return null;

  return (
    <SubmitButton variant="contained" sx={{ mt: 2 }}>
      Save
    </SubmitButton>
  );
};

const Notify = () => {
  const { loading } = useLoading();
  const { notify, updateNotify } = useAlerts();
  const emails = notify.filter((n) => n.type === "email");
  const sms = notify.filter((n) => n.type === "sms");
  const fixedSMS = sms.filter((s) => s.fixed).map((s) => s.contact);
  const fixedEmails = emails.filter((e) => e.fixed).map((e) => e.contact);

  return (
    <Box
      borderLeft={(t) => `1px solid ${t.palette.divider}`}
      pl={2}
      position="relative"
    >
      <Loading loading={loading.notify} />
      <Form
        onSubmit={(values) => updateNotify([...values.sms, ...values.emails])}
        initialValues={{
          emails: [],
          sms: [],
        }}
      >
        <Box>
          <Typography variant="h6">Send notifications to: </Typography>
          <FormLabel>Emails</FormLabel>
          <AutoComplete
            limitTags={2}
            fixed={fixedEmails}
            name="emails"
            options={emails.map((e) => e.contact)}
            getOptionLabel={(option) =>
              fixedEmails.includes(option) ? "DevEmail" : option
            }
            size="small"
            placeholder="Click so select"
            sx={{ mb: 2 }}
          />
          <FormLabel>Telephones</FormLabel>
          <AutoComplete
            name="sms"
            limitTags={2}
            fixed={fixedSMS}
            placeholder="Click so select"
            options={sms.map((s) => s.contact)}
            getOptionLabel={(option) =>
              fixedSMS.includes(option) ? "SOC Mobile" : "+971" + option
            }
            size="small"
          />
          <SaveButton />
        </Box>
      </Form>
    </Box>
  );
};

export default Notify;
