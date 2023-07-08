import { Button } from "@mui/material";
import Dialog from "../common/utils/Dialogue";
import useAlerts from "./hooks/useAlerts";

const Interact = () => {
  const { interacted, updateClient } = useAlerts();

  const handleClose = () => updateClient("interacted", true);

  return (
    <Dialog
      open={!interacted}
      onClose={handleClose}
      onClick={handleClose}
      action={
        <Button variant="contained" onClick={handleClose}>
          Close
        </Button>
      }
    >
      Because you turned on system sound, you will always see this window
      everytime the page loads/reloads. This is to make sure that you don't
      forget to interact with the page. Most modern browsers will not play sound
      through websites unless the user has interacted with the page at least
      once.
    </Dialog>
  );
};

export default Interact;
