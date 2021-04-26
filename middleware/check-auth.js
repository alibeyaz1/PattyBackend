const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.token;

    jwt.verify(token, "PATTY_TOKEN_KEY");
    req.params.userId = jwt.decode(token).userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth Failed!" });
  }
};