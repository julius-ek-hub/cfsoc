const updateObj = (obj, key, value) => {
  const _obj = { ...obj };
  eval(`_obj.${key} = value`);
  return _obj;
};

module.exports = { updateObj };
