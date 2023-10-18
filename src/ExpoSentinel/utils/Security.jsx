import { useEffect, useState } from "react";

import TableMui from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

import SecurityIcon from "@mui/icons-material/Security";

import IconButton from "../../common/utils/IconButton";
import Dialog from "../../common/utils/Dialogue";

import {
  _entr,
  entr_,
  field_separator as fs,
  objectExcept,
  all_permissions,
} from "./utils";

import useSheet from "../hooks/useSheet";
import useFetch from "../../common/hooks/useFetch";
import useToasts from "../../common/hooks/useToast";
import useCommonSettings from "../../common/hooks/useSettings";

export default function Security() {
  const { active_sheet, is_creator, updateSheet } = useSheet();
  const { staffs, uname } = useCommonSettings();
  const [open, setOpen] = useState(false);
  const [perms, setPerms] = useState({});
  const { patch } = useFetch("/expo-sentinel");
  const { push } = useToasts();

  const { permissions, key } = active_sheet || {};

  const p = permissions || {};

  const _staffs = objectExcept(staffs, [uname, "system", active_sheet.creator]);

  const getPermissions = (username) =>
    Array.isArray(p[username]) ? p[username] : ["read"];

  useEffect(() => {
    setPerms(entr_(_entr(_staffs).map(([k, v]) => [k, getPermissions(k)])));
  }, [active_sheet, open]);

  if (!active_sheet || !is_creator) return null;

  const handleClose = () => setOpen(false);

  const handlePermissionChange = (staff, perm, value) => {
    if (perm === "read" && !value) return setPerms({ ...perms, [staff]: [] });
    if (value)
      return setPerms({
        ...perms,
        [staff]: [...new Set([...perms[staff], "read", perm])],
      });
    setPerms({
      ...perms,
      [staff]: [...new Set(perms[staff].filter((p) => p !== perm))],
    });
  };

  const handleUpdate = async () => {
    const { json } = await patch(`/update-structure`, [
      [
        key,
        {
          permissions: perms,
        },
      ],
    ]);

    if (!json.error) {
      updateSheet(`${key + fs}permissions`, perms);
      handleClose();
      return push({
        message: "Security changes applied",
        severity: "success",
      });
    } else
      push({
        message: `Failed to apply security changes: ${json.error}`,
        severity: "error",
      });
  };

  return (
    <>
      <IconButton
        Icon={SecurityIcon}
        onClick={() => setOpen(true)}
        title={`Click to change security`}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        title="Accessibility"
        onXClose={handleClose}
        action={
          <>
            <Button color="inherit" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleUpdate}>
              Update
            </Button>
          </>
        }
      >
        <TableContainer>
          <TableMui stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Staff</TableCell>
                {Object.values(all_permissions).map((p) => (
                  <Tooltip title={p.description} key={p.name}>
                    <TableCell align="center">{p.name}</TableCell>
                  </Tooltip>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(_staffs).map((staff) => (
                <TableRow key={staff.username}>
                  <TableCell>{staff.name}</TableCell>
                  {Object.keys(all_permissions).map((p) => (
                    <TableCell key={p} align="center">
                      <Checkbox
                        checked={perms[staff.username]?.includes(p)}
                        onChange={(e, v) =>
                          handlePermissionChange(staff.username, p, v)
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </TableMui>
        </TableContainer>
      </Dialog>
    </>
  );
}
