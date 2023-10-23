import Button from "@mui/material/Button";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Confirm from "../../../../common/utils/Comfirm";
import NewColumn from "./NewColumn";
import Style from "./Style";
import CopyStyle from "./CopyStyle";
import PasteStyle from "./PasteStyle";
import Form from "../Form";
import BlancRows from "../BlancRows";
import MoveRow from "./MoveRow";

import useSheet from "../../../hooks/useSheet";
import useAddModify from "../../../hooks/useAddModify";

const ActionButtons = () => {
  const { active_sheet, permission } = useSheet();
  const { _delete } = useAddModify();

  const { selected, columns, name } = active_sheet;

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
              {/* {selected.length === 1 && <MoveRow _id={selected[0]} />} */}
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
            </Confirm>
          )}
        </>
      )}
    </>
  );
};

export default ActionButtons;
