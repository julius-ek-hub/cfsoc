import Button from "@mui/material/Button";

import JoinFullIcon from "@mui/icons-material/JoinFull";

import Confirm from "../../common/utils/Comfirm";
import IconButton from "../../common/utils/IconButton";

import useFetcher from "../hooks/useFetcher";

const Update = ({ btn_props }) => {
  const { updateWithMitreData } = useFetcher();

  return (
    <Confirm
      onConfirm={updateWithMitreData}
      ok_text="UPDATE"
      Clickable={(props) => (
        <IconButton
          title="Sync with MITIRE ATT&amp;CK server"
          {...props}
          {...btn_props}
          color="inherit"
          Icon={JoinFullIcon}
        />
      )}
    >
      This process will update the database with latest <b>L2</b>, <b>L3</b>,{" "}
      <b>L4</b>, <b>Car Analytics</b> and <b>Dev</b> Use Cases from MITIRE
      ATT&amp;CK server.
    </Confirm>
  );
};

export default Update;
