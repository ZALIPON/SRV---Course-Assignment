function isAdmin(req, res, next) {
  if (req.user?.role?.toLowerCase() === 'admin') return next();
  res.status(403).json({ error: 'NoNoNo! For Admin only' });
}

module.exports = { isAdmin };