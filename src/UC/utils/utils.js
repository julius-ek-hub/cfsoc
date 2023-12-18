export const field_separator = "<@>";

export const fix_data = (data) =>
  entr_(
    _entr(data).map(([key, value]) => [
      key,
      {
        value: value?.hasOwnProperty("value") ? value.value : value,
        sx: value?.sx || {},
      },
    ])
  );

export const deepKey = (key, obj, update) => {
  const keys = key.split(field_separator);
  const lastKey = keys.at(-1);
  const object = keys
    .reverse()
    .slice(1)
    .reverse()
    .reduce((prev, next) => {
      return (
        prev[isNaN(next) ? next : Number(next)] ||
        (Array.isArray(prev) ? [] : {})
      );
    }, obj);
  return update ? { object, lastKey } : object[lastKey];
};

export const _entr = (ob) => Object.entries(ob);
export const entr_ = (arr) => Object.fromEntries(arr);
export const _l = (str) => String(str).toLowerCase().trim();
export const _u = (str) => String(str).toUpperCase().trim();
export const _keys = (ob) => Object.keys(ob);
export const _values = (ob) => Object.values(ob);
