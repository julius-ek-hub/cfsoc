import * as React from "react";

import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";

import { useFormikContext } from "formik";

/**
 * @param {AutocompleteProps} props
 */

export default function AutoComplete(props) {
  const { errors, values, handleChange, touched } = useFormikContext();

  const {
    name,
    options,
    multiple = true,
    label,
    placeholder,
    helperText,
    size,
    sx,
    fixed = [],
    onChange: oC,
    getOptionLabel,
    isFixed,
    ...rest
  } = props;

  const error = errors[name];
  const value = values[name];

  const hasError = Boolean(error && touched[name]);

  const onChange = (e, val) => {
    let value = val;
    if (fixed?.length > 0 && multiple) {
      value = [
        ...fixed,
        ...val.filter((v) => (isFixed ? !isFixed(v) : fixed.indexOf(v) === -1)),
      ];
    } else if (fixed?.length > 0) {
      value = fixed;
    }

    handleChange({ target: { value, name } });
    !hasError && oC?.call({}, e, value);
  };

  return (
    <Autocomplete
      multiple={multiple}
      options={options}
      disableCloseOnSelect={multiple}
      value={value}
      fullWidth
      filterSelectedOptions
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
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            label={getOptionLabel ? getOptionLabel(option) : option}
            {...getTagProps({ index })}
            disabled={
              isFixed ? Boolean(isFixed(option)) : fixed.indexOf(option) !== -1
            }
          />
        ))
      }
      {...rest}
    />
  );
}
