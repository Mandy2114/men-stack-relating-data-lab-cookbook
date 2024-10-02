function setUserLocals(req, res, next) {
  res.local.user = res.user || null;
  next();
};

module.exports = setUserLocals;