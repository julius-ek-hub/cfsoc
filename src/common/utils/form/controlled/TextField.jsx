import { useState } from "react";

import { TextFieldProps } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import OwnTextField from "../uncontrolled/TextField";
import IconButton from "../../IconButton";

import { useFormikContext } from "formik";

/**
 * @param {TextFieldProps & {onEnterButtonPressed: Function, enterButton: Boolean}} props
 */

const TextField = (props) => {
  const { errors, touched, values, handleChange, submitForm } =
    useFormikContext();
  const [visible, setVisible] = useState(false);

  const { name, helperText, type, enterButton, ...rest } = props;

  const error = errors[name];
  const value = values[name];

  const hasError = Boolean(touched[name] && error);

  const onlyNumbers = (e) => {
    if (type === "number" && !e.code?.match(/Digit[0-9]|(Backspace)|(Arrow*)/i))
      e.preventDefault();
  };

  return (
    <OwnTextField
      error={hasError}
      value={value}
      name={name}
      autoComplete="off"
      type={
        type === "password" && visible
          ? "text"
          : type === "number"
          ? "text"
          : type
      }
      onKeyDown={onlyNumbers}
      onChange={handleChange}
      placeholder={props.placeholder || props.label}
      helperText={error || helperText}
      {...(enterButton && {
        onEnterButtonPressed: submitForm,
      })}
      {...(value &&
        type === "password" && {
          InputProps: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setVisible(!visible)}
                  Icon={visible ? VisibilityOffIcon : VisibilityIcon}
                />
              </InputAdornment>
            ),
          },
        })}
      {...rest}
    />
  );
};

export default TextField;
