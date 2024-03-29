const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const db = require("../db");
const { createToken } = require("../jwt");
const { body, validationResult } = require("express-validator");
const checkEmailNotInUse = require("../validators/checkEmailNotInUse");
const passwordHasNoEmptySpace = require("../validators/passwordHasNoEmptySpace");
const userIdIsValid = require("../validators/userIdIsValid");
const userIsNonMember = require("../validators/userIsNonMember");

exports.sign_up = [
  body("name", "Name is invalid")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage(
      "Invalid name length. Name length must be at least 1 character"
    )
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
    .exists({ values: "falsy" })
    .withMessage("Email is missing")
    .bail()
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
  body("password")
    .exists({ values: "falsy" })
    .withMessage("Password is missing")
    .escape(),
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

exports.grant_membership = [
  body("userId")
    .trim()
    .escape()
    .exists({ values: "falsy" })
    .withMessage("User ID is missing")
    .bail()
    .custom((userId) => {
      return new Promise((resolve, reject) => {
        userIdIsValid(userId)
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
    .bail()
    .withMessage("Could not find user id")
    .custom((userId) => {
      return new Promise((resolve, reject) => {
        userIsNonMember(userId)
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
    .withMessage("User is already a member"),
  body("passcode")
    .trim()
    .escape()
    .exists({ values: "falsy" })
    .withMessage("Please provide the passcode")
    .bail()
    .equals("banana")
    .withMessage("Incorrect passcode"),
  (req, res) => {
    const result = validationResult(req);
    const id = req.body.userId;

    if (!req.authenticated) {
      return res.status(401).json({ message: "Unauthenticated request" });
    }

    if (result.isEmpty()) {
      // This first query updates the membership to member
      db.query(
        "UPDATE users SET membership = 'member' WHERE users.id = ?",
        [id],
        (error, result) => {
          if (error) {
            console.log(error);
            return res
              .status(500)
              .json({ message: "Internal server error", error });
          } else {
            console.log(result);
            // This second query retrieves the information for the user who just became a member and returns an updated cookie that reflects the
            // change in membership status
            db.query(
              "SELECT id, name, email, membership FROM users where id = ?",
              [id],
              (error, result) => {
                if (error) {
                  return res
                    .status(500)
                    .json({ message: "Internal server error", error });
                }
                const user = result[0];
                const accessToken = createToken(user);
                return res
                  .cookie("access-token", accessToken, {
                    maxAge: 60 * 60 * 24 * 30 * 1000,
                    secure: true,
                    sameSite: "strict",
                    domain: process.env.DOMAIN,
                  })
                  .status(200)
                  .json({ message: `Membership granted to user ${id}` });
              }
            );
          }
        }
      );
    } else {
      return res
        .status(400)
        .json({ message: "Membership grant failed", error: result.array() });
    }
  },
];
