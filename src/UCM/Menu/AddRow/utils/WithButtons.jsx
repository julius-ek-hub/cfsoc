import Button from "@mui/material/Button";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

import Confirm from "../../../../common/utils/Comfirm";
import NewColumn from "./NewColumn";
import ViewRelated from "./ViewRelated";

import useSheet from "../../../hooks/useSheet";

import useAddModify from "../../../hooks/useAddModify";
import { Typography } from "@mui/material";

const WithButtons = ({ Form, name }) => {
  const { active_sheet, sheets } = useSheet();
  const { _delete } = useAddModify();

  const { selected, key, columns, locked } = active_sheet;

  const has_olumns = Object.keys(columns || {}).length > 0;
  if (locked) return null;

  return (
    <>
      {selected.length == 0 && (
        <>
          {has_olumns && (
            <Form
              Button={(props) => (
                <Button color="inherit" endIcon={<AddIcon />} {...props}>
                  Add new {name} row
                </Button>
              )}
            />
          )}
          <NewColumn
            Button={(props) => (
              <Button color="inherit" endIcon={<AddIcon />} {...props}>
                Add new {name} column
              </Button>
            )}
          />
        </>
      )}
      {selected.length === 1 && (
        <Form
          edit={selected[0]}
          Button={(props) => (
            <Button color="inherit" endIcon={<EditIcon />} {...props}>
              Edit selected
            </Button>
          )}
        />
      )}
      {selected.length >= 1 && (
        <>
          <ViewRelated _ids={selected} />
          <Confirm
            ok_color="error"
            onConfirm={_delete}
            fullWidth
            Clickable={(props) => (
              <Button color="error" endIcon={<DeleteIcon />} {...props}>
                Delete selected
              </Button>
            )}
          >
            Delete selected row{selected.length === 1 ? "" : "s"}?
            {key === "l3_uc" && (
              <Typography color="error" mt={1} display="flex">
                <PriorityHighIcon fontSize="small" />
                All realated {sheets.l4_uc.name} would be deleted as well.
              </Typography>
            )}
            {key === "l2_uc" && (
              <Typography color="error" mt={1} display="flex">
                <PriorityHighIcon fontSize="small" />
                All realated {sheets.l3_uc.name} &amp; {sheets.l4_uc.name} would
                be deleted as well.
              </Typography>
            )}
          </Confirm>
        </>
      )}
    </>
  );
};

export default WithButtons;
