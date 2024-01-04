import { useEffect, useState } from "react";

import TextField from "../common/utils/form/uncontrolled/TextField";

import Confirm from "../common/utils/Comfirm";

import useKeepass from "./hooks/useKeepass";
import useFetcher from "./hooks/useFetcher";

import { deepKey } from "../common/utils/utils";

const AddGroup = ({ Initiator, edit, $location, onDone }) => {
  const [name, setName] = useState("");
  const { dbs } = useKeepass();
  const { addGroup } = useFetcher();

  const df = deepKey($location, dbs) || {};

  const aG = () => addGroup(name, $location, edit, onDone);

  useEffect(() => {
    edit && setName(df.name || "");
  }, [edit]);

  return (
    <>
      <Confirm
        Initiator={Initiator}
        title={edit ? "Rename Group" : "Add Group"}
        ok_text={edit ? "Rename" : "Add"}
        disabled={!name}
        onConfirm={aG}
      >
        <TextField
          label="Name"
          size="small"
          margin="dense"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          onEnterButtonPressed={aG}
        />
      </Confirm>
    </>
  );
};

export default AddGroup;
