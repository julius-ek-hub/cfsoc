import { ReactNode } from "react";
import Text from "@mui/material/Typography";

import { Formik, FormikConfig } from "formik";

/**
 * @param {FormikConfig & {title: ReactNode, description: ReactNode}} props
 */

function Form(props) {
  const { children, title, description, ...rest } = props;
  return (
    <Formik {...rest}>
      {() => (
        <>
          {title &&
            (typeof title === "string" ? (
              <Text variant="h4">{title}</Text>
            ) : (
              title
            ))}
          {description &&
            (typeof description === "string" ? (
              <Text mb={2}>{description}</Text>
            ) : (
              title
            ))}
          {children}
        </>
      )}
    </Formik>
  );
}

export default Form;
