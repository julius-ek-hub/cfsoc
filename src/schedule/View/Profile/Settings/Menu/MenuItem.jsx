import Box from "@mui/material/Box";
import MI from "@mui/material/MenuItem";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import IconButton from "../../../../../common/utils/IconButton";
import Confirm from "../../../../../common/utils/Comfirm";

import useCommonSettings from "../../../../../common/hooks/useSettings";

function MenuItem({
  children,
  Editor,
  no_edit,
  no_delete,
  delete_message,
  onDelete,
}) {
  const { admin } = useCommonSettings();
  return (
    <MI
      sx={{
        "&:hover .MuiBox-root": {
          visibility: "visible",
        },
      }}
    >
      {children}
      {admin && (
        <Box visibility="hidden" ml="auto">
          {Editor && !no_edit && (
            <Editor
              ClickComponent={(props) => (
                <IconButton
                  Icon={EditIcon}
                  size="small"
                  sx={{ ml: 1 }}
                  iprop={{ fontSize: "small" }}
                  title="Edit"
                  {...props}
                />
              )}
            />
          )}
          {!no_delete && (
            <Confirm
              onConfirm={onDelete}
              Clickable={(props) => (
                <IconButton
                  Icon={DeleteIcon}
                  size="small"
                  sx={{ ml: 1 }}
                  iprop={{ fontSize: "small", color: "error" }}
                  title="Remove"
                  {...props}
                />
              )}
            >
              {delete_message}
            </Confirm>
          )}
        </Box>
      )}
    </MI>
  );
}

export default MenuItem;
