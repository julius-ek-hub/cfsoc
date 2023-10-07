import GitHubIcon from "@mui/icons-material/GitHub";

import IconButton from "../IconButton";
import Confirm from "../Comfirm";

import useFetch from "../../hooks/useFetch";
import useLoading from "../../hooks/useLoading";

const UpdateUI = ({ user }) => {
  const { get } = useFetch("/auth");
  const { update } = useLoading();

  if (user.ui_changed) return null;

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
        <IconButton Icon={GitHubIcon} sx={{ ml: 3 }} {...props} />
      )}
    >
      Hello
    </Confirm>
  );
};

export default UpdateUI;
