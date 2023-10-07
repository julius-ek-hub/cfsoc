import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import SearchIcon from "@mui/icons-material/Search";
import Add from "@mui/icons-material/Add";

import Card from "./Card";
import Nav from "../common/utils/Nav";
import Middle from "../common/utils/Middle";
import IconButton from "../common/utils/IconButton";
import Dialog from "../common/utils/Dialogue";
import TextField from "../common/utils/form/uncontrolled/TextField";

import useFetch from "../common/hooks/useFetch";
import useCommonSettings from "../common/hooks/useSettings";

const Apps = () => {
  const default_values = {
    title: { label: "Title", value: "" },
    description: { label: "Description", value: "" },
    to: { label: "Location", value: "" },
    status: { label: "Status", value: "" },
  };
  const { user, apps, update } = useCommonSettings();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);
  const [edit_id, setedit_id] = useState(null);
  const { get, patch, post, dlete } = useFetch("/apps");

  const _apps = Array.isArray(apps) ? apps : [];

  const getApps = async () => {
    const { json } = await get();
    if (!json.error) update("apps", json);
  };

  const handleClose = async () => {
    setForm({ ...default_values });
    setOpen(false);
    setedit_id(null);
    setError(null);
  };

  const handleOpen = async () => {
    setForm({ ...default_values });
    setOpen(true);
  };
  const handleEdit = async (_id) => {
    const for_edit = _apps.find((app) => app._id === _id);
    if (!for_edit) return;

    const vals = { ...default_values };

    Object.keys(vals).map((key) => (vals[key].value = for_edit[key]));
    setForm(vals);
    setOpen(true);
    setedit_id(_id);
  };
  const handleDelete = async (_id) => {
    const { json } = await dlete(`?_id=${_id}`);
    if (!json.error)
      update(
        "apps",
        _apps.filter((app) => app._id !== _id)
      );
  };

  const handleChange = async (value, key) => {
    setForm({
      ...form,
      [key]: {
        ...form[key],
        value,
      },
    });
    setError(null);
  };

  const handleSave = async () => {
    if (Object.values(form).some((v) => !v.value.trim()))
      return setError("**All fields are required");
    const _form = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v.value])
    );
    if (edit_id) {
      const { json } = await patch(`?_id=${edit_id}`, _form);
      if (!json.error) {
        const __apps = [..._apps];
        const ind = __apps.findIndex((app) => app._id === edit_id);
        const target = { ...__apps[ind] };
        Object.entries(_form).map(([k, v]) => {
          target[k] = v;
        });
        __apps[ind] = target;
        update("apps", __apps);
      }
    } else {
      const { json } = await post("", _form);
      if (!json.error)
        update("apps", [..._apps, { ..._form, _id: json.insertedId }]);
    }

    handleClose();
  };

  useEffect(() => {
    if (_apps.length === 0) getApps();
  }, []);

  if (!user) return null;

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Nav />
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        p={2}
        overflow="hidden"
      >
        <Middle flexDirection="row" gap={2} mt={2}>
          <TextField size="small" placeholder="Search Apps" type="search" />
          <IconButton Icon={SearchIcon} />
        </Middle>
        <Divider sx={{ my: 3 }} />
        <Box
          flexGrow={1}
          display="flex"
          gap={2}
          flexWrap="wrap"
          alignContent="flex-start"
          overflow="auto"
        >
          {_apps.map((app) => (
            <Card
              key={app._id}
              onDelete={handleDelete}
              onEdit={handleEdit}
              {...app}
            />
          ))}
        </Box>
        <Middle>
          <Button color="inherit" endIcon={<Add />} onClick={handleOpen}>
            Add App
          </Button>
        </Middle>
      </Box>
      <Dialog
        onXClose={handleClose}
        open={open}
        title={edit_id ? "Edit App Info" : "Add App"}
        fullWidth
        action={
          <>
            <Button color="inherit" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </>
        }
      >
        {error && <Typography color="error">{error}</Typography>}
        {Object.entries(form).map(([key, value]) => (
          <TextField
            key={key}
            multiline
            margin="dense"
            label={value.label}
            fullWidth
            value={value.value}
            onChange={(e) => handleChange(e.target.value, key)}
          />
        ))}
      </Dialog>
    </Box>
  );
};

export default Apps;
