import * as React from "react";

import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";

import { useFormikContext } from "formik";

/**
 * @param {AutocompleteProps} props
 */

export default function AutoComplete(props) {
  const { errors, values, handleChange } = useFormikContext();

  const {
    name,
    options,
    multiple = true,
    label,
    placeholder,
    helperText,
    size,
    sx,
    fixed,
    getOptionLabel,
    onChange: oC,
    ...rest
  } = props;

  const error = errors[name];
  const value = values[name];

  const hasError = Boolean(error);

  const onChange = (e, value) => {
    handleChange({ target: { value, name } });
    !hasError && oC?.call({}, e, value);
  };

  const preventTypingIfError = (e) => {
    if (hasError) return e.preventDefault();
  };

  return (
    <Autocomplete
      multiple={multiple}
      options={options}
      disableCloseOnSelect={multiple}
      value={value}
      fullWidth
      filterSelectedOptions
      onKeyDown={preventTypingIfError}
      onChange={onChange}
      sx={{ mt: 1, ...sx }}
      getOptionLabel={getOptionLabel}
      renderOption={(props, option) => {
        return (
          <li {...props}>{getOptionLabel ? getOptionLabel(option) : option}</li>
        );
      }}
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
