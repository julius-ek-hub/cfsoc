export const field_separator = "<@>";
import { _entr, entr_ } from "../../common/utils/utils";

export const fix_data = (data) =>
  entr_(
    _entr(data).map(([key, value]) => [
      key,
      {
        value: value?.hasOwnProperty("value") ? value.value : value,
      },
    ])
  );
