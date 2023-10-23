import * as React from "react";

import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";

/**
 * @param {AutocompleteProps} props
 */

export default function AutoComplete(props) {
  const {
    multiple = true,
    label,
    placeholder,
    helperText,
    size,
    fixed,
    getOptionLabel,
    ...rest
  } = props;

  return (
    <Autocomplete
      multiple={multiple}
      disableCloseOnSelect={multiple}
      fullWidth
      filterSelectedOptions
      getOptionLabel={getOptionLabel}
      renderOption={(props, option) => {
        return (
          <li {...props}>{getOptionLabel ? getOptionLabel(option) : option}</li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder || label}
          helperText={helperText}
          size={size}
        />
      )}
      {...(fixed && {
        renderTags: (tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={getOptionLabel ? getOptionLabel(option) : option}
              {...getTagProps({ index })}
              disabled={fixed.indexOf(option) !== -1}
            />
          )),
      })}
      {...rest}
    />
  );
}
