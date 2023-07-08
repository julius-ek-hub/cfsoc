import { useEffect } from "react";

import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";

import Form from "../common/utils/form/controlled/Form";
import AutoComplete from "../common/utils/form/controlled/AutoComplete";

import Loading from "./Loading";

import { useFormikContext } from "formik";

import * as Yup from "yup";

import useAlerts from "./hooks/useAlerts";
import useLoading from "../common/hooks/useLoading";
import useDimension from "../common/hooks/useDimensions";
import Button from "@mui/material/Button";

import { getBrowserType } from "./utils";

const schema = Yup.object({
  email: Yup.array(Yup.string().email("Invalid email")),
  push: Yup.array(Yup.string()),
  sms: Yup.array(
    Yup.string()
      .min(9, "Invalid telephone number")
      .max(9, "Invalid telephone number")
      .matches(/5[0-9]/, "Invalid telephone number")
  ),
});

const SetInitial = () => {
  const { account } = useAlerts();
  const emails = account.emails_sms?.filter((n) => n.type === "email") || [];
  const sms = account.emails_sms?.filter((n) => n.type === "sms") || [];
  const push = account.push_notification || [];

  const activeSMS = sms.filter((s) => s.active).map((s) => s.contact);
  const activeEmails = emails.filter((e) => e.active).map((s) => s.contact);
  const activePush = push.filter((e) => e.active).map((s) => s.device);

  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    setFieldValue("sms", activeSMS);
    setFieldValue("email", activeEmails);
    setFieldValue("push", activePush);
  }, [account]);

  return null;
};

const Notify = () => {
  const { loading } = useLoading();
  const {
    enableNotification,
    account,
    push_registered,
    subscribeForPushNotifications,
    updateNotify,
    alarm,
  } = useAlerts();
  const { up } = useDimension();
  const emails = account.emails_sms?.filter((n) => n.type === "email") || [];
  const sms = account.emails_sms?.filter((n) => n.type === "sms") || [];
  const push = account.push_notification || [];

  const enabled = account.enabled_notifications || [];

  const updateNotification = async (type, value) => {
    try {
      await schema.validate({ [type]: value });
      updateNotify({ type, value });
    } catch (error) {}
  };

  return (
    <Box
      borderLeft={(t) => `1px solid ${t.palette.divider}`}
      pl={2}
      position="relative"
      display="flex"
      gap={4}
      flexWrap="wrap"
    >
      <Loading loading={loading.notify} />
      <Form
        validationSchema={schema}
        initialValues={{
          email: [],
          sms: [],
          push: [],
        }}
      >
        <Box width={up.md ? "40%" : "100%"} flexGrow={1}>
          <Typography variant="h5">
            Notifications:{" "}
            <Switch
              checked={enabled.length > 0}
              onChange={(e, c) =>
                enableNotification(c, ["email", "sms", "push", "sound"])
              }
            />
          </Typography>
          <Typography color="success.main">
            * Disable Notifications before leaving your shift.
          </Typography>
          <Typography variant="h6">
            Conditional:{" "}
            <Switch
              checked={["email", "sms"].some((n) => enabled.includes(n))}
              onChange={(e, c) => enableNotification(c, ["email", "sms"])}
            />
          </Typography>
          <FormHelperText>
            Conditional notifications will be sent only if an alert is almost
            breaching its SLA.
          </FormHelperText>
          <FormLabel>
            Emails{" "}
            <Switch
              checked={enabled.includes("email")}
              onChange={(e, c) => enableNotification(c, ["email"])}
            />
          </FormLabel>
          <AutoComplete
            disabled={!enabled.includes("email")}
            limitTags={2}
            name="email"
            onChange={(e, value, formik) =>
              updateNotification("email", value, formik)
            }
            options={emails.map((e) => e.contact)}
            size="small"
            placeholder="Click so select"
            sx={{ mb: 2 }}
            freeSolo
          />
          <FormLabel>
            SMS{" "}
            <Switch
              checked={enabled.includes("sms")}
              onChange={(e, c) => enableNotification(c, ["sms"])}
            />
          </FormLabel>
          <AutoComplete
            disabled={!enabled.includes("sms")}
            onChange={(e, value, formik) =>
              updateNotification("sms", value, formik)
            }
            name="sms"
            limitTags={2}
            placeholder="Click so select"
            options={sms.map((s) => s.contact)}
            getOptionLabel={(option) => "+971" + option}
            size="small"
            freeSolo
          />
        </Box>
        <Box width={up.md ? "40%" : "100%"} flexGrow={1}>
          <Typography variant="h6">
            Live:{" "}
            <Switch
              checked={["sound", "push"].some((n) => enabled.includes(n))}
              onChange={(e, c) => enableNotification(c, ["sound", "push"])}
            />
          </Typography>
          <FormHelperText>
            Live notifications are sent immidiately an alert is received.
          </FormHelperText>
          <FormLabel>
            Push Notification{" "}
            <Switch
              checked={enabled.includes("push")}
              onChange={(e, c) => enableNotification(c, ["push"])}
            />
          </FormLabel>
          <AutoComplete
            disabled={!enabled.includes("push")}
            name="push"
            sx={{ mb: 3 }}
            limitTags={2}
            onChange={(e, value, formik) =>
              updateNotification("push", value, formik)
            }
            helperText={
              <>
                Push notifications can also be sent to your device through the
                browser that was used to subscribe.{" "}
                {!push_registered && (
                  <>
                    <Button
                      size="small"
                      sx={{ p: 0, minWidth: 0 }}
                      onClick={subscribeForPushNotifications}
                    >
                      Click here
                    </Button>{" "}
                    to subscribe with this browser.
                  </>
                )}
              </>
            }
            placeholder="Click so select"
            getOptionLabel={(p) =>
              p === window.navigator.userAgent.toLocaleLowerCase()
                ? "This browser"
                : getBrowserType(p)
            }
            options={push.map((s) => s.device)}
            size="small"
          />
          <FormLabel>
            System Sound{" "}
            <Switch
              checked={alarm}
              onChange={(e, c) => enableNotification(c, ["sound"])}
            />
          </FormLabel>
          <FormHelperText sx={{ ml: 1.3 }}>
            This browser can also be made to play a sound. The option only works
            when you interact with the page atleast once everytime it loads.
            That is, Whenever the page loads/reloads, just click anywhere on it.
          </FormHelperText>
          <SetInitial />
        </Box>
      </Form>
    </Box>
  );
};

export default Notify;
