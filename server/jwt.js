const { sign, verify, decode } = require("jsonwebtoken");

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
  const accessToken = req.cookies && req.cookies["access-token"];
  const decodedToken = accessToken && decode(accessToken, { json: true });

  if (!accessToken) {
    req.authenticated = false;
    return next();
  }

  try {
    const tokenIsValid = verify(accessToken, process.env.JWT_SECRET);
    if (tokenIsValid) {
      req.authenticated = true;
      req.admin = decodedToken.membership === "admin";
      return next();
    }
  } catch (err) {
    return res.status(401).json({ message: err });
  }
};

module.exports = { createToken, validateToken };
