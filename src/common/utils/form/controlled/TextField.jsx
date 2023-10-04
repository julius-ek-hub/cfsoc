import { TextFieldProps } from "@mui/material/TextField";

import OwnTextField from "../uncontrolled/TextField";

import { useFormikContext } from "formik";

/**
 * @param {TextFieldProps & {onEnterButtonPressed: Function, enterButton: Boolean}} props
 */

const TextField = (props) => {
  const { errors, touched, values, handleChange, submitForm } =
    useFormikContext();

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
      type={type === "number" ? "text" : type}
      onKeyDown={onlyNumbers}
      onChange={handleChange}
      placeholder={props.placeholder || props.label}
      helperText={error || helperText}
      {...(enterButton && {
        onEnterButtonPressed: submitForm,
      })}
      {...rest}
    />
  );
};

export default TextField;
