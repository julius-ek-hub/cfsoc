import Box from "@mui/material/Box";

import GitHubIcon from "@mui/icons-material/GitHub";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import IconButton from "../IconButton";
import Confirm from "../Comfirm";

const num = (version) =>
  Number((typeof version === "string" ? version : "0").split(".").join(""));

const UpdateUI = ({ user }) => {
  const { old_version, new_version } = user.app_versions || {};

  if (old_version === new_version || num(old_version) > num(new_version))
    return null;

  return (
    <Confirm
      fullWidth
      is_alert
      title={`New version | ${new_version}`}
      Clickable={(props) => (
        <>
          <IconButton
            Icon={GitHubIcon}
            sx={{ ml: 3, mr: 1 }}
            {...props}
            title="New version available"
          />
          {old_version}
          <ArrowForwardIcon fontSize="small" sx={{ mx: 1 }} />
          {new_version}
        </>
      )}
    >
      Go to the Desktop of the server machine, right-click on <b>cfsoc</b>{" "}
      folder and choose <b>Open in Terminal</b>. Type the command{" "}
      <Box component="code" color="error.main">
        npm run pull
      </Box>{" "}
      and hit Enter. <b>{`(Wait for the process to complete)`}</b>
      <p>
        This will pull all updates from the GitHub repository into the local
        server and restart the server.
      </p>
    </Confirm>
  );
};

export default UpdateUI;
