import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Edit from "@mui/icons-material/Edit";

import TextField from "../../common/utils/form/uncontrolled/TextField";
import useCommonSettings from "../../common/hooks/useSettings";
import IconButton from "../../common/utils/IconButton";
import Dialog from "../../common/utils/Dialogue";
import Confirm from "../../common/utils/Comfirm";
import Middle from "../../common/utils/Middle";

import useSheet from "../hooks/useSheet";
import useFetch from "../../common/hooks/useFetch";
import useToasts from "../../common/hooks/useToast";

import { field_separator as fs } from "../utils/utils";

const Description = () => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const { active_sheet, updateSheet, permission } = useSheet();
  const { patch } = useFetch("/expo-sentinel");
  const { push } = useToasts();
  const { hide_header } = useCommonSettings();

  let { name, key } = active_sheet;
  const dsc = active_sheet.description || "";

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    const { json } = await patch(`/update-structure`, [[key, { description }]]);

    if (json.error) return push({ message: json.error, severity: "error" });

    updateSheet(`${key + fs}description`, description);
    push({ message: "Sheet updated!", severity: "success" });
    handleClose();
  };

  useEffect(() => {
    if (open) setDescription(active_sheet.description || "");
  }, [open]);

  if (hide_header) return null;

  return (
    <Middle mb={2} color="text.secondary" px={2} textAlign="center">
      <Box>
        {permission.includes("modify") && (
          <>
            <IconButton
              onClick={() => setOpen(true)}
              Icon={Edit}
              iprop={{ fontSize: "15px" }}
              size="small"
              title="Edit description"
              sx={{ mr: 1 }}
            />
            <Dialog
              title={`Edit description | ${name}`}
              open={open}
              onClose={handleClose}
              onXClose={handleClose}
              fullWidth
              action={
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
              }
            >
              <TextField
                multiline
                minRows={4}
                fullWidth
                size="small"
                margin="dense"
                label="Description"
                placeholder="Description"
                helperText="Optional"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Dialog>
            {!dsc && `<No description>`}
          </>
        )}
        {dsc.substring(0, 110)}
        {dsc.length > 100 && (
          <Confirm
            title={`${name} | description`}
            is_alert
            expandable
            Clickable={(props) => (
              <Box
                component="span"
                {...props}
                color="primary.main"
                ml={1}
                fontWeight="bold"
                sx={{ cursor: "pointer" }}
              >
                read more...
              </Box>
            )}
          >
            {dsc.split("\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Confirm>
        )}
      </Box>
    </Middle>
  );
};

export default Description;
