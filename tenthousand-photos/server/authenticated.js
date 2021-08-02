const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //doing it this way because will follow the Bearer convention
    const incomingToken = req.headers.authorization.split(" ")[1];
    const decryptedToken = jwt.verify(incomingToken, "10KC_secret");
    req.userData = { email: decryptedToken.email, userId: decryptedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token...",
    });
  }
};
