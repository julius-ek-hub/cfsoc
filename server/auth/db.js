const { arr_to_obj } = require("../schedules/utils/common");
const Staff = require("./model");

const getStaff = async (filter, select = "") => {
  const staffs = await Staff.find(filter, select).select(select).lean();
  return arr_to_obj(staffs, "username");
};

const updateStaff = async (filter, update) => {
  const $new = await Staff.findOneAndUpdate(
    filter,
    { $set: update },
    { new: true }
  );
  return $new.toObject();
};

const addStaff = async (staff) => {
  const $new = new Staff(staff);
  await $new.save();
  return $new;
};
const deleteStaff = async (username) => {
  return await Staff.findOneAndDelete({ username });
};

module.exports = { getStaff, updateStaff, addStaff, deleteStaff };
