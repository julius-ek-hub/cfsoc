import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

import Confirm from "../../../../common/utils/Comfirm";
import NewColumn from "./NewColumn";
import Style from "./Style";
import CopyStyle from "./CopyStyle";
import PasteStyle from "./PasteStyle";
import Form from "../Form";
import BlancRows from "../BlancRows";

import useSheet from "../../../hooks/useSheet";
import useAddModify from "../../../hooks/useAddModify";

const ActionButtons = () => {
  const { active_sheet, sheets, permission } = useSheet();
  const { _delete } = useAddModify();

  const { selected, key, columns, name } = active_sheet;

  const has_olumns = Object.keys(columns || {}).length > 0;

  return (
    <>
      {selected.length == 0 && permission.includes("write") && (
        <>
          {has_olumns && (
            <>
              <Form
                Button={(props) => (
                  <Button color="inherit" endIcon={<AddIcon />} {...props}>
                    Add new {name} row
                  </Button>
                )}
              />
              <BlancRows
                Button={(props) => (
                  <Button color="inherit" endIcon={<AddIcon />} {...props}>
                    {`Add Blanc Row(s) to ${name}`}
                  </Button>
                )}
              />
            </>
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
      {selected.length >= 1 && (
        <>
          {permission.includes("modify") && (
            <>
              {selected.length === 1 && (
                <>
                  <Form
                    edit={selected[0]}
                    Button={(props) => (
                      <Button color="inherit" endIcon={<EditIcon />} {...props}>
                        Edit values
                      </Button>
                    )}
                  />
                </>
              )}
              {selected.length === 1 && (
                <>
                  <Style _id={selected[0]} />
                  <CopyStyle _id={selected[0]} />
                </>
              )}
              <PasteStyle />
            </>
          )}
          {permission.includes("delete") && (
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
                  All realated {sheets.l3_uc.name} &amp; {sheets.l4_uc.name}{" "}
                  would be deleted as well.
                </Typography>
              )}
            </Confirm>
          )}
        </>
      )}
    </>
  );
};

export default ActionButtons;
