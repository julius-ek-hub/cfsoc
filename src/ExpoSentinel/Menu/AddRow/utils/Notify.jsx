import { useState } from "react";

import InputAdornment from "@mui/material/InputAdornment";

import Middle from "../../../../common/utils/Middle";
import IconButton from "../../../../common/utils/IconButton";
import TextField from "../../../../common/utils/form/uncontrolled/TextField";

import Search from "@mui/icons-material/Search";
import Close from "@mui/icons-material/Close";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

import useSheet from "../../../hooks/useSheet";
import useSettings from "../../../hooks/useSettings";
import useFile from "../../../../common/hooks/useFile";

const Notify = () => {
  const { setSearch } = useSheet();
  const { settings, updateSettings } = useSettings();
  const [value, setValue] = useState("");
  const { pickFile } = useFile();

  const handleSearch = () => {
    updateSettings("search", false);
    setSearch(value);
  };
  const handleClose = () => {
    updateSettings("search", false);
    setSearch([]);
  };

  const handleTest = async () => {
    const files = await pickFile("*", true);

    const fd = new FormData();
    fd.append(
      "email",
      JSON.stringify({
        subject: "Mac OS Latest",
        html: "Must reply first b4 anything",
        to: "julius.ek.dev@gmail.com",
      })
    );
    files.map((file, i) => fd.append(`file_${i}`, file));

    const f = await fetch("https://www.247-dev.com/api/email/send", {
      method: "POST",
      headers: {
        "x-auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1bGl1cyIsImV4dGVybmFsIjp0cnVlfQ.RYgMtpgW7_bYMCTN29xY6QJsNmNPE-QXssNc-eqGv6w",
      },
      body: fd,
    });
    f.json().then(console.log);
  };

  return <IconButton Icon={NotificationsActiveIcon} onClick={handleTest} />;
};

export default Notify;
