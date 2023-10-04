import {
  MobileDateTimePicker,
  MobileDateTimePickerProps,
} from "@mui/x-date-pickers/MobileDateTimePicker";
import {
  DesktopDateTimePicker,
  DesktopDateTimePickerProps,
} from "@mui/x-date-pickers/DesktopDateTimePicker";
import {
  MobileDatePicker,
  MobileDatePickerProps,
} from "@mui/x-date-pickers/MobileDatePicker";
import {
  DesktopDatePicker,
  DesktopDatePickerProps,
} from "@mui/x-date-pickers/DesktopDatePicker";
import {
  MobileTimePicker,
  MobileTimePickerProps,
} from "@mui/x-date-pickers/MobileTimePicker";
import {
  DesktopTimePicker,
  DesktopTimePickerProps,
} from "@mui/x-date-pickers/DesktopTimePicker";

import LocalizationProvider from "./LocalizationProvider";

import useDimension from "../../../../../common/hooks/useDimensions";

/**
 * Responsive MUIDatePicker
 *
 * Added an extra prop `type` to determine which DatePicker to render which can be any of:
 *
 * `date` for `DatePicker`
 *
 * `datetime` for `DateTimePicker`
 *
 * `time` for `TimePicker`
 *
 * @type {{type: 'date' | 'datetime' | 'time', size: 'small' | 'medium'} & (DesktopDateTimePickerProps | MobileDateTimePickerProps | MobileDatePickerProps | DesktopDatePickerProps | MobileTimePickerProps | DesktopTimePickerProps)}
 *
 */

export let datePickerProps;

/**
 *
 * @param {typeof datePickerProps} props
 */

export default function DatePicker(props) {
  const {
    up: { md },
  } = useDimension();

  const pickers = {
    time: md ? DesktopTimePicker : MobileTimePicker,
    date: md ? DesktopDatePicker : MobileDatePicker,
    datetime: md ? DesktopDateTimePicker : MobileDateTimePicker,
  };

  const { type = "date", format, ...rest } = props;

  let Picker = pickers[type];

  return (
    <LocalizationProvider>
      <Picker format={format} {...rest} />
    </LocalizationProvider>
  );
}
