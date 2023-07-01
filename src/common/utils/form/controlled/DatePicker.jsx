import UncontrolledDatePicker, {
  datePickerProps,
} from "../uncontrolled/DatePicker";

import { useFormikContext } from "formik";

/**
 * @param {typeof datePickerProps & {name: String}} props
 */

const DatePicker = (props) => {
  const { errors, touched, values, handleChange } = useFormikContext();

  const { name, type, format, helperText, ...rest } = props;

  const error = errors[name];
  const value = values[name];

  const hasError = Boolean(touched[name] && error);

  const onChange = (value) => {
    handleChange({ target: { value, name } });
  };

  return (
    <UncontrolledDatePicker
      format={format}
      type={type}
      onAccept={onChange}
      value={value}
      slotProps={{
        textField: {
          ...rest,
          name,
          error: hasError,
          helperText: error || helperText,
        },
      }}
    />
  );
};

export default DatePicker;
