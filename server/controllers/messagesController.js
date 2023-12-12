const asyncHandler = require("express-async-handler");
const db = require("../db");

exports.member_messages_get = asyncHandler(async (req, res) => {
  db.query(
    "SELECT messages.title, messages.text, messages.date, users.name FROM messages JOIN users ON messages.user_id = users.id",
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
        .json({ message: "Messages for members fetched successfully", result });
    }
  );
});

exports.non_member_messages_get = asyncHandler(async (req, res) => {
  db.query(
    "SELECT messages.title, messages.text FROM messages",
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

exports.messages_create = asyncHandler(async (req, res) => {
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

      // TODO: Make sure that only authenticated users can send these requests
      return res
        .status(201)
        .json({ message: "Message created successfully", result });
    }
  );
});

exports.messages_delete = asyncHandler(async (req, res) => {
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

      // TODO: Make sure that only the admin can do this
      return res
        .status(200)
        .json({ message: "Message deleted successfully", result });
    }
  );
});
