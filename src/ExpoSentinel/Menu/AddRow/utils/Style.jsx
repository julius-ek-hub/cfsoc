import { useEffect, useState } from "react";

import { useFormikContext } from "formik";

import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";

import EditIcon from "@mui/icons-material/Edit";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import Dialog from "../../../../common/utils/Dialogue";
import AutoComplete from "../../../../common/utils/form/controlled/AutoComplete";
import SubmitButton from "../../../../common/utils/form/controlled/SubmitButton";
import TextField from "../../../../common/utils/form/controlled/TextField";
import Form from "../../../../common/utils/form/controlled/Form";
import IconButton from "../../../../common/utils/IconButton";
import Menu from "../../../../common/utils/Menu";

import useSheet from "../../../hooks/useSheet";

import * as Yup from "yup";

import {
  _entr,
  entr_,
  field_separator as fs,
  objectExcept,
  default_styles,
} from "../../../utils/utils";

import useFetch from "../../../../common/hooks/useFetch";
import useToasts from "../../../../common/hooks/useToast";

const Style = ({ _id }) => {
  const [open, setOpen] = useState(false);

  const { patch } = useFetch("/expo-sentinel");
  const { push } = useToasts();

  const {
    active_content,
    active_sheet,
    updateSheet,
    sorted_columns: cols,
  } = useSheet();

  const targetIndex = active_content.findIndex((ac) => ac._id.value === _id);
  const target = active_content[targetIndex];
  if (!target) return;

  const default_sx = entr_(
    cols
      .map(([k]) => {
        const sx = target[k]?.sx || {};
        return _entr({ ...default_styles }).map(([_k, _v]) => [
          `${k}____${_k}`,
          sx[_k] || _v.default,
        ]);
      })
      .flat()
  );

  const d_ent = _entr(default_sx);

  const style_schema = Yup.object(
    entr_(d_ent.map(([k, v]) => [k, Yup.string()]))
  );

  const handleClose = () => setOpen(false);

  const handleUpdate = async (update) => {
    const _target = { ...target };

    cols.map(([k, v]) => {
      const sx = entr_(
        _entr(default_styles).map(([_k, _v]) => [_k, update[`${k}____${_k}`]])
      );

      const prop = { ...(_target[k] || {}) };
      prop.sx = sx;
      _target[k] = prop;
    });

    const { json } = await patch(`/data?sheet=${active_sheet.key}`, {
      _id,
      update: objectExcept(_target, ["_id"]),
    });

    if (json.error) {
      push({
        message: `Failed to apply style: ${json.error}`,
        severity: "error",
      });
    } else {
      push({ message: "Styles applied.", severity: "success" });
      handleClose();
      updateSheet(
        `${active_sheet.key + fs}content${fs + targetIndex}`,
        _target
      );
      updateSheet(
        `${active_sheet.key + fs}selected`,
        active_sheet.selected.filter((s) => s !== _id)
      );
    }
  };

  const Container = ({ label, children, _key }) => {
    const fk = useFormikContext();
    const [copyOpen, setCopyOpen] = useState(false);

    const hanldleCloseCopy = () => setCopyOpen(false);

    const _cols = cols.filter((c) => c[0] !== _key);

    const revert = () => {
      _entr(default_styles).map(([k, v]) => {
        fk.setFieldValue(`${_key}____${k}`, v.default);
      });
    };

    const copyStyle = (to) => {
      if (to == "*") {
        _entr(default_styles).map(([k, v]) => {
          _cols.map((c) => {
            fk.setFieldValue(`${c[0]}____${k}`, fk.values[`${_key}____${k}`]);
          });
        });
      } else {
        _entr(default_styles).map(([k, v]) => {
          fk.setFieldValue(`${to}____${k}`, fk.values[`${_key}____${k}`]);
        });
      }
      hanldleCloseCopy();
    };

    useEffect(() => {
      if (!open) fk.resetForm();
    }, [open]);

    return (
      <>
        <InputLabel sx={{ mb: 1 }}>{label}</InputLabel>
        {children}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          <Menu
            open={copyOpen}
            onClose={hanldleCloseCopy}
            Clickable={(props) => (
              <Button
                endIcon={<KeyboardArrowDownIcon />}
                sx={{ justifyContent: "start", flexShrink: 0 }}
                color="inherit"
                onClick={(e) => {
                  setCopyOpen(true);
                  props.onClick(e);
                }}
              >
                Copy Styles to
              </Button>
            )}
          >
            <Box width={200} p={1}>
              {[["*", { label: "All" }], ..._cols].map(([k, v]) => (
                <Button
                  key={k}
                  sx={{ justifyContent: "start", whiteSpace: "nowrap" }}
                  color="inherit"
                  fullWidth
                  onClick={() => copyStyle(k)}
                >
                  {v.label}
                </Button>
              ))}
            </Box>
          </Menu>
          <IconButton
            Icon={SettingsBackupRestoreIcon}
            sx={{ ml: 2 }}
            title="Revert to original"
            onClick={revert}
          />
        </Box>
      </>
    );
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        endIcon={<EditIcon />}
        color="inherit"
      >
        Edit style
      </Button>
      <Form
        initialValues={default_sx}
        onSubmit={handleUpdate}
        validationSchema={style_schema}
      >
        <Dialog
          open={open}
          onXClose={handleClose}
          fullWidth
          title="Edit Style"
          action={
            <>
              <Button color="inherit" onClick={handleClose}>
                Cancel
              </Button>
              <SubmitButton color="primary" variant="contained">
                Save
              </SubmitButton>
            </>
          }
        >
          {cols.map(([k, v]) => (
            <Stack
              key={k}
              mb={2}
              border={(t) => `1px solid ${t.palette.divider}`}
              p={2}
            >
              <Container label={v.label} _key={k}>
                {_entr(default_styles).map(([_k, _v]) => {
                  return _v.type === "list" ? (
                    <AutoComplete
                      key={_k}
                      name={`${k}____${_k}`}
                      options={_v.value}
                      multiple={false}
                      label={_v.label}
                    />
                  ) : (
                    <TextField
                      key={_k}
                      name={`${k}____${_k}`}
                      margin="dense"
                      label={_v.label}
                      type={_v.type}
                      {...(_k === "fontSize" && {
                        InputProps: {
                          endAdornment: (
                            <InputAdornment position="end">
                              {_k === "fontSize" ? "px" : "%"}
                            </InputAdornment>
                          ),
                        },
                      })}
                      {...(_k === "padding" && {
                        helperText: (
                          <>
                            Amount of space around element.{" "}
                            <a
                              href="https://www.w3schools.com/css/css_padding.asp"
                              target="_blank"
                              style={{ textDecoration: "underline" }}
                            >
                              Learn more...
                            </a>
                          </>
                        ),
                      })}
                    />
                  );
                })}
              </Container>
            </Stack>
          ))}
        </Dialog>
      </Form>
    </>
  );
};

export default Style;
