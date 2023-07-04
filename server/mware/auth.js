module.exports = async (req, res, next) => {
  if (req.url.split("/").includes("auth")) return next();

  const token = req.query.auth;
  if (!token)
    return res.json({ error: "Not Allowed", errorCode: 405, stack: "Null" });
  next();
};
