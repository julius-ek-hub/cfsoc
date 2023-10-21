import { useEffect, useState } from "react";

import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import Add from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

import useSheet from "../hooks/useSheet";
import useFetcher from "../hooks/useFetcher";
import Confirm from "../../common/utils/Comfirm";

const Upload = () => {
  const [map, setMap] = useState(false);
  const { active_sheet } = useSheet();
  const { extractFromFile } = useFetcher();
  const [maps, setMaps] = useState({});

  const { columns, name, key, primary_column } = active_sheet;

  const cols = Object.entries(columns || {}).filter((c) => !c[1].calculate);

  const resetMaps = () =>
    setMaps(Object.fromEntries(cols.map(([k, v]) => [k, v.label])));

  const handleClose = (changeState) => {
    setMap(false);
    resetMaps();
    changeState?.call();
  };
  const doSubmit = async (changeState) => {
    const submitted = await extractFromFile(maps, primary_column);
    submitted && handleClose(changeState);
  };

  useEffect(() => {
    resetMaps();
  }, [key]);

  return (
    <Confirm
      close_on_ok={false}
      ok_text={
        <>
          <UploadIcon />
          Upload
        </>
      }
      title={
        <>
          <Box display="flex" alignItems="center">
            <PriorityHighIcon /> Important
          </Box>
        </>
      }
      onClose={handleClose}
      onConfirm={doSubmit}
      Clickable={(props) => (
        <Button color="inherit" startIcon={<FileUploadIcon />} {...props}>
          Import {name || "Sheet"}
        </Button>
      )}
    >
      <div>- For Excel/CSV, column names must be located at the first row.</div>
      {cols.length > 0 ? (
        <>
          - Worksheet/JSON must have all the following columns/fields{" "}
          <strong>
            <code>{cols.map((c) => c[0]).join(", ")}</code>
          </strong>
          . with excactly the same spelling.
          <div>
            Or map each of the fields above to the corresponding column/field
            names in your file. {`(Copy-paste for accuracy)`}
          </div>
          {map && (
            <>
              <Typography variant="h6" my={2}>
                Field mapping
              </Typography>
              {cols.map(([col, v]) => (
                <TextField
                  label={col}
                  fullWidth
                  placeholder={`${col} name in file...`}
                  margin="dense"
                  key={col}
                  value={maps[col]}
                  onChange={(e) => {
                    setMaps({ ...maps, [col]: e.target.value });
                  }}
                />
              ))}
            </>
          )}
          <div>
            {!map && (
              <Button
                color="inherit"
                sx={{ mt: 1 }}
                endIcon={<Add />}
                onClick={() => setMap(true)}
              >
                Add field mappings
              </Button>
            )}
          </div>
        </>
      ) : (
        "- Make sure that the column/field names are unique. For best result, Use alphanumeric naming convention."
      )}
    </Confirm>
  );
};

export default Upload;
