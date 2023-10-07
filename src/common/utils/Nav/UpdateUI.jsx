import GitHubIcon from "@mui/icons-material/GitHub";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import IconButton from "../IconButton";
import Confirm from "../Comfirm";

import useFetch from "../../hooks/useFetch";
import useLoading from "../../hooks/useLoading";

const UpdateUI = ({ user }) => {
  const { get } = useFetch("/auth");
  const { update } = useLoading();

  const { old_version, new_version } = user.app_versions;

  if (old_version === new_version) return null;

  const updateUI = async () => {
    update(true);
    await get("/update-ui");
    update(false);
    window.location.reload();
  };

  return (
    <Confirm
      onConfirm={updateUI}
      fullWidth
      Clickable={(props) => (
        <>
          <IconButton
            Icon={GitHubIcon}
            sx={{ ml: 3, mr: 1 }}
            {...props}
            title="Version changed, click to apply"
          />
          {old_version}
          <ArrowForwardIcon fontSize="small" sx={{ mx: 1 }} />
          {new_version}
        </>
      )}
    >
      This process will pull all project changes from GitHub into CFSOC local
      server, rebuild and restart the server and then reload this browser.
      <p>
        If for some reason, a problem arises, update manually through the steps
        in <b>update.txt</b> found on the Desktop
      </p>
    </Confirm>
  );
};

export default UpdateUI;
