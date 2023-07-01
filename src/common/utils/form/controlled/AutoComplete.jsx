import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { useFormikContext } from "formik";

import { u } from "../../utils";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/**
 * @param {AutocompleteProps} props
 */

export default function AutoComplete(props) {
  const { errors, touched, values, handleChange } = useFormikContext();

  const { name, options, label, placeholder, helperText, size } = props;

  const error = errors[name];
  const value = values[name];

  const hasError = Boolean(touched[name] && error);

  const _name = (opt) => opt.split(".").map(u).join(" ");

  const onChange = (e, value) => {
    handleChange({ target: { value, name } });
  };

  return (
    <Autocomplete
      multiple
      options={options}
      disableCloseOnSelect
      value={value}
      fullWidth
      onChange={onChange}
      getOptionLabel={_name}
      sx={{ mt: 1 }}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {_name(option)}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={placeholder || label}
          placeholder={placeholder || label}
          helperText={hasError ? error : helperText}
          error={hasError}
          size={size}
        />
      )}
    />
  );
}
