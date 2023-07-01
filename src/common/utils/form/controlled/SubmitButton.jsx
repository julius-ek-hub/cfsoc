import { FunctionComponent } from "react";

import { ButtonProps, Button as MuiButton } from "@mui/material";

import { useFormikContext } from "formik";

/**
 * @param {{Component: FunctionComponent} & ButtonProps} props 
 */

function SubmitButton(props) {
    const { submitForm } = useFormikContext();
    const { Button = MuiButton, ...rest } = props;
    return <Button {...rest} onClick={submitForm} />
}

export default SubmitButton;