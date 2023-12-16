const { sign, verify } = require("jsonwebtoken");

const createToken = (user) => {
  const accessToken = sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      membership: user.membership,
    },
    process.env.JWT_SECRET
  );

  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const tokenIsValid = verify(accessToken, process.env.JWT_SECRET);
    if (tokenIsValid) {
      req.authenticated = true;
      return next;
    }
  } catch (err) {
    return res.status(401).json({ message: err });
  }
};

module.exports = { createToken, validateToken };
