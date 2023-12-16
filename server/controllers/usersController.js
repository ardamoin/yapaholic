const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const db = require("../db");
const { createToken, validateToken } = require("../jwt");
const { body, validationResult } = require("express-validator");
const checkEmailNotInUse = require("../validators/checkEmailNotInUse");
const passwordHasNoEmptySpace = require("../validators/passwordHasNoEmptySpace");

exports.sign_up = [
  body("name", "Name is invalid")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Invalid name length. Name length must at least 1 character")
    .isLength({ max: 50 })
    .withMessage(
      "Invalid name length. Name length cannot exceed 50 characters"
    ),
  body("email", "Email is invalid")
    .trim()
    .escape()
    .isEmail()
    .withMessage("Entered value is not a valid email address")
    .custom((email) => {
      return new Promise((resolve, reject) => {
        checkEmailNotInUse(email)
          .then((result) => {
            if (result === true) {
              resolve();
            } else {
              reject();
            }
          })
          .catch((err) => {
            reject("Database error: ", err.message);
          });
      });
    })
    .withMessage("Email is already in use"),
  body("password")
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage("Password length must be at least 6 characters")
    .isLength({ max: 50 })
    .withMessage("Password length cannot exceed 50 characters")
    .custom(passwordHasNoEmptySpace)
    .withMessage("Password cannot contain any empty space"),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { name, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 8);

      db.query(
        "INSERT INTO users(name, email, password) VALUES(?, ?, ?)",
        [name, email, hashedPassword],
        (error, result) => {
          const newUserId = result.insertId;

          if (error) {
            console.log(error);
            return res
              .status(500)
              .json({ message: "Internal server error", error });
          } else {
            const accessToken = createToken({
              id: newUserId,
              email: email,
              name: name,
              membership: "non-member",
            });

            res.cookie("access-token", accessToken, {
              maxAge: 60 * 60 * 24 * 30 * 1000,
              secure: true,
              sameSite: "strict",
              domain: process.env.DOMAIN,
            });

            return res
              .status(201)
              .json({ message: "User successfully created", result });
          }
        }
      );
    } else {
      return res
        .status(400)
        .json({ message: "Input validation failed", errors: result.array() });
    }
  }),
];

//User validation logic to be added
exports.log_in = [
  body("email")
    .escape()
    .custom((email) => {
      return new Promise((resolve, reject) => {
        checkEmailNotInUse(email)
          .then((result) => {
            if (result === false) {
              resolve();
            } else {
              reject();
            }
          })
          .catch((err) => {
            reject("Database error: ", err.message);
          });
      });
    })
    .withMessage("Email could not be found"),
  body("password").escape(),
  (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { email, password } = req.body;
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        asyncHandler(async (error, result) => {
          if (error) {
            console.log(error);
            return res
              .status(500)
              .json({ message: "Internal server error", error });
          }

          if (result.length === 0) {
            return res.status(404).json({ message: "User not found" });
          }

          const user = result[0];
          const passwordFromDb = user.password;

          const match = await bcrypt.compare(password, passwordFromDb);

          if (!match) {
            return res.status(401).json({ message: "Incorrect password" });
          } else {
            const accessToken = createToken(user);

            res.cookie("access-token", accessToken, {
              maxAge: 60 * 60 * 24 * 30 * 1000,
              secure: true,
              sameSite: "strict",
              domain: process.env.DOMAIN,
            });

            return res.status(200).json({ message: "Logged in" });
          }
        })
      );
    } else {
      return res
        .status(400)
        .json({ message: "Login failed", error: result.array() });
    }
  },
];

exports.log_out = (req, res) => {
  res
    .cookie("access-token", "", {
      expires: new Date(0),
      secure: true,
      sameSite: "strict",
      domain: process.env.DOMAIN,
    })
    .send();
};
