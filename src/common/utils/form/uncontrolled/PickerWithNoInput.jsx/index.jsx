import { Box } from "@mui/material";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  DateCalendar as DC,
  DateCalendarProps,
} from "@mui/x-date-pickers/DateCalendar";
import {
  StaticDatePicker,
  StaticDatePickerProps,
} from "@mui/x-date-pickers/StaticDatePicker";
import {
  StaticTimePicker,
  StaticTimePickerProps,
} from "@mui/x-date-pickers/StaticTimePicker";

/**
 * @param {StaticDatePickerProps | StaticTimePickerProps &  {title: String, type: 'date' | 'time'}} param0
 */

const PickerWithNoInput = ({ title, type = "date", ...rest }) => {
  const Picker = type === "date" ? StaticDatePicker : StaticTimePicker;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Picker
        {...(title && {
          slots: {
            toolbar: () => (
              <Box gridColumn={2} px={3} pt={2}>
                <Typography
                  textTransform="uppercase"
                  color="text.secondary"
                  mb={2}
                >
                  {title}
                </Typography>
                <Divider />
              </Box>
            ),
          },
        })}
        {...rest}
      />
    </LocalizationProvider>
  );
};

/**
 *
 * @param {DateCalendarProps} props
 */

export const DateCalendar = (props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DC {...props} />
    </LocalizationProvider>
  );
};

export default PickerWithNoInput;
