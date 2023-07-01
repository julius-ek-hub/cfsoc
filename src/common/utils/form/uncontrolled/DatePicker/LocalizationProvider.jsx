import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  LocalizationProvider as LP,
  LocalizationProviderProps,
} from "@mui/x-date-pickers/LocalizationProvider";

/**
 * @param {LocalizationProviderProps} props
 */

const LocalizationProvider = (props) => (
  <LP dateAdapter={AdapterDayjs} {...props} />
);

export default LocalizationProvider;
