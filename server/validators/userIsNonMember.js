const db = require("../db");

module.exports = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT EXISTS (SELECT 1 FROM users WHERE id = ? AND membership = 'non-member') AS is_non_member",
      [id],
      (error, result) => {
        if (error) {
          reject(new Error("Database connection error: " + error));
        }

        resolve(result[0].is_non_member === 1);
      }
    );
  });
};
