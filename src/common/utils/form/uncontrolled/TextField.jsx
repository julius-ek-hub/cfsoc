import MuiTextField, { TextFieldProps } from "@mui/material/TextField";

/**
 * @param {TextFieldProps & {onEnterButtonPressed: Function}} props
 */

const TextField = ({ onEnterButtonPressed, ...rest }) => {
  return (
    <MuiTextField
      placeholder={rest.placeholder || rest.label}
      {...rest}
      {...(typeof onEnterButtonPressed === "function"
        ? {
            onKeyDown: (e) => {
              e.stopPropagation();
              if (e.key === "Enter" || e.code === "Enter") {
                e.preventDefault();
                onEnterButtonPressed(e);
                rest.onKeyDown?.call({}, e);
              }
            },
          }
        : {
            onKeyDown: (e) => {
              e.stopPropagation();
              rest.onKeyDown?.call({}, e);
            },
          })}
    />
  );
};

export default TextField;
