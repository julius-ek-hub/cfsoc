import { useState } from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import Checkbox from "@mui/material/Checkbox";

import But from "./But";
import Confirm from "../common/utils/Comfirm";

import useKeepass from "./hooks/useKeepass";
import useFetcher from "./hooks/useFetcher";
import useLocalStorage from "../common/hooks/useLocalStorage";

const UploadDB = () => {
  const [checked, setChecked] = useState(false);
  const { dbs } = useKeepass();
  const { uploadDB } = useFetcher();
  const { get, set } = useLocalStorage();

  return (
    <Confirm
      is_alert
      title="One moment!"
      ok_text="Upload"
      ok_button_props={{
        endIcon: <FileUploadIcon />,
      }}
      onClose={() => setChecked(false)}
      onConfirm={async () => {
        await uploadDB();
        checked && set("no_kdbx_upload_advice", true);
      }}
      Initiator={(props) => (
        <But
          EndIcon={FileUploadIcon}
          sx={{ justifyContent: "center", mb: 4 }}
          onClick={uploadDB}
          {...(!get("no_kdbx_upload_advice") && { ...props })}
        >
          {dbs.length === 0 ? "Upload" : "Replace"} DB
        </But>
      )}
    >
      Only database files generated by KeePass App are allowed. They have the
      extension .kdbx or .kdb
      <Box>
        In case the file is located in your CORP machine, then do the following:
        <ol>
          <li>
            Connect both your CORP machine and the SOC machine where the local
            server is running, to the same WiFi network. Eg. EAC_TECH
          </li>
          <li>
            Open a terminal in the SOC machine where the local server is running
            and type{" "}
            <Box component="code" color="primary.main">
              ipconfig /all.
            </Box>
          </li>
          <li>
            From the result of the above command, search for IPv4 Address and
            take note of the value
          </li>
          <li>
            On your CORP machine, visit
            <Box component="code" color="primary.main">
              {` http://<IPv4>:4999/keepass where `}
            </Box>
            <Box component="code" color="primary.main">
              {` <IPv4> `}
            </Box>
            is the result above.
          </li>
          <li>
            Sample:{" "}
            <Box component="code" color="primary.main">
              {`http://10.131.20.18:4999/keepass `}
            </Box>
          </li>
          <li>You can now upload the KDBX file</li>
        </ol>
        <Box my={1}>
          NB: The data from the database file and it's master key are not saved
          any where. They're being read and authenticated from the file by a
          KeePass legit NodeJS library known as{" "}
          <a href="https://github.com/keeweb/kdbxweb" target="_blank">
            kdbxweb
          </a>
        </Box>
        <Box my={1}>
          <Checkbox checked={checked} onChange={() => setChecked(!checked)} />{" "}
          Don't show this again
        </Box>
      </Box>
    </Confirm>
  );
};

export default UploadDB;
