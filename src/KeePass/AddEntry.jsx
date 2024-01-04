import { useState } from "react";

import * as Yup from "yup";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import SubmitButton from "../common/utils/form/controlled/SubmitButton";
import TextField from "../common/utils/form/controlled/TextField";
import Form from "../common/utils/form/controlled/Form";

import useKeepass from "./hooks/useKeepass";
import useFetcher from "./hooks/useFetcher";

import { th } from "./utils";
import { _entr, _keys, _values, entr_, deepKey } from "../common/utils/utils";

const validationSchema = Yup.object(
  entr_(
    _entr(th).map((k, v) => [
      k,
      k === "url" ? Yup.string().url() : Yup.string(),
    ])
  )
);

const AddEntry = ({ Initiator, edit, $location, onDone }) => {
  const [open, setOpen] = useState(false);
  const { dbs } = useKeepass();

  const { addEntry } = useFetcher();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const df = deepKey($location, dbs) || {};

  const initialValues = entr_(_entr(th).map(([k, v]) => [k, df[k] || ""]));

  return (
    <>
      <Initiator onClick={handleOpen} />
      <Drawer
        open={open}
        anchor="right"
        sx={{ zIndex: (t) => t.zIndex.modal }}
        onClose={handleClose}
      >
        <Form
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(entry, f) => {
            if (_values(entry).every((_v) => !_v))
              return _keys(th).map((k) =>
                f.setFieldError(k, "Atleast 1 field is needed")
              );

            addEntry(entry, $location, edit);
            onDone?.call();
          }}
        >
          <Box
            display="flex"
            p={2}
            flexDirection="column"
            height="100%"
            width={300}
          >
            <Typography variant="h6">
              {edit ? "Edit Entry" : "Add Entry"}
            </Typography>
            <Box flexGrow={1} overflow="auto">
              {_entr(th).map(([k, v]) => (
                <TextField
                  name={k}
                  key={k}
                  size="small"
                  label={v.label}
                  margin="dense"
                  fullWidth
                  type={k === "password" ? "password" : "text"}
                  multiline={k === "notes"}
                />
              ))}
            </Box>
            <Box gap={1} display="flex">
              <SubmitButton variant="contained" size="small">
                Save
              </SubmitButton>
              <Button size="small" color="inherit" onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Form>
      </Drawer>
    </>
  );
};

export default AddEntry;
