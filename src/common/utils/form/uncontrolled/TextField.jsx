import MuiTextField, { TextFieldProps } from "@mui/material/TextField";

/**
 * @param {TextFieldProps & {onEnterButtonPressed: Function}} props
 */

const TextField = ({ onEnterButtonPressed, ...rest }) => {
  return (
    <MuiTextField
      {...rest}
      {...(typeof onEnterButtonPressed === "function" && {
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.code === "Enter") {
            e.preventDefault();
            onEnterButtonPressed(e);
            rest.onKeyDown?.call({}, e);
          }
        },
      })}
    />
  );
};

export default TextField;
