import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import MuiButton from "@mui/material/Button";

import TextField from "../../../common/utils/form/uncontrolled/TextField";
import Menu from "../../../common/utils/Menu";

import useAddModify from "../../hooks/useAddModify";

import { entr_ } from "../../utils/utils";

const BlancRows = ({ Button }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(1);
  const [error, setError] = useState(null);

  const { cols, save } = useAddModify();

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!value) return setError("Required");
    if (isNaN(value)) return setError("Not a number");
    const val = Number(value);

    if (val < 0 || val > 50) return setError("Number not within range 1 to 50");
    setError(null);
    const newBlancs = [...new Array(val)].map(() =>
      entr_(cols.map(([k]) => [k, { value: "", sx: {} }]))
    );
    save(newBlancs, null, handleClose);
  };

  useEffect(() => {
    setValue(1);
  }, [open]);

  return (
    <Menu
      open={open}
      onClose={handleClose}
      Clickable={(props) => (
        <Button
          onClick={(e) => {
            setOpen(true);
            props.onClick(e);
          }}
        />
      )}
    >
      <Box p={2} width={250} display="flex" gap={2}>
        <TextField
          size="small"
          label="Blanc row(s)"
          placeholder="Number of empty rows"
          value={value}
          type="number"
          onChange={(e) => {
            setError(null);
            setValue(e.target.value);
          }}
          inputProps={{ min: 1, max: 50 }}
          {...(error
            ? {
                helperText: error,
                error: true,
              }
            : { helperText: "Min = 1, Max = 50" })}
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">X</InputAdornment>,
          }}
        />
        {value && <MuiButton onClick={handleSubmit}>Add</MuiButton>}
      </Box>
    </Menu>
  );
};

export default BlancRows;
