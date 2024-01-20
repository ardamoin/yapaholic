const asyncHandler = require("express-async-handler");
const db = require("../db");
const { body, validationResult } = require("express-validator");
const userIdIsValid = require("../validators/userIdIsValid");

exports.member_messages_get = asyncHandler(async (req, res) => {
  if (req.authenticated) {
    db.query(
      "SELECT messages.id, messages.title, messages.text, messages.date, users.name FROM messages JOIN users ON messages.user_id = users.id",
      (error, result) => {
        if (error) {
          console.log(error);
          return res
            .status(500)
            .json({ message: "Internal server error", error });
        }

        return res.status(200).json({
          message: "Messages for members fetched successfully",
          result,
        });
      }
    );
  } else {
    return res.status(401).json({
      message: "Unauthenticated request",
    });
  }
});

exports.non_member_messages_get = asyncHandler(async (req, res) => {
  db.query(
    "SELECT messages.id, messages.title, messages.text FROM messages",
    (error, result) => {
      console.log(result);
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ message: "Internal server error", error });
      }

      res.status(200).json({
        message: "Messages for non members fetched successfully",
        result,
      });
    }
  );
});

exports.messages_create = [
  body("user_id", "User ID is invalid")
    .trim()
    .escape()
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
    .withMessage("Could not find user id"),
  body("title").trim().escape(),
  body("text")
    .trim()
    .customSanitizer((value) => {
      return value.replace(/[^a-zA-Z0-9\s.,!?;:'"-]/g, "");
    })
    .exists({ values: "falsy" })
    .withMessage("Message text is missing"),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({
        message: "Failed to create new message",
        error: result.array(),
      });
    }

    if (req.authenticated) {
      db.query(
        "INSERT INTO messages(title, text, user_id) VALUES(?, ?, ?)",
        [req.body.title, req.body.text, req.body.user_id],
        (error, result) => {
          console.log(result);
          if (error) {
            console.log(error);
            return res
              .status(500)
              .json({ message: "Internal server error", error });
          }

          return res
            .status(201)
            .json({ message: "Message created successfully", result });
        }
      );
    } else {
      return res.status(401).json({
        message: "Unauthenticated request",
      });
    }
  }),
];

exports.messages_delete = asyncHandler(async (req, res) => {
  if (!req.admin) {
    return res.status(401).json({ message: "User is not admin" });
  }

  if (req.authenticated) {
    db.query(
      "DELETE FROM messages WHERE id = ?",
      [req.body.message_id],
      (error, result) => {
        console.log(result);
        if (error) {
          console.log(error);
          return res
            .status(500)
            .json({ message: "Internal server error", error });
        }

        return res
          .status(200)
          .json({ message: "Message deleted successfully", result });
      }
    );
  } else {
    return res.status(401).json({
      message: "Unauthenticated request",
    });
  }
});
