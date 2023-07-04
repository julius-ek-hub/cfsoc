const {
  getNotify: gn,
  saveNotify: sn,
  deleteNotify: dn,
  updateNotify: un,
} = require("../db/notify");

const getNotify = async (req, res) => {
  const notify = await gn();
  res.json(notify);
};

const saveNotify = async (req, res) => {
  let { contact, type, active } = req.body;
  const exist = await gn({ contact });

  if (exist.length > 0)
    return res.json({
      error: `Contact exists.`,
      field: "contact",
    });

  const add = await sn({ contact, type, active });
  res.json(add);
};

const deleteNotify = async (req, res) => {
  const deleted = await dn(req.query.contact);
  res.json({ ...deleted });
};

const updateNotify = async (req, res) => {
  const contacts = await un(req.body);
  res.json(contacts);
};

module.exports = {
  saveNotify,
  getNotify,
  deleteNotify,
  updateNotify,
};
