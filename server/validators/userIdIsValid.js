const db = require("../db");

module.exports = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT EXISTS ( SELECT 1 FROM users WHERE id = ? ) AS id_exists",
      [id],
      (error, result) => {
        if (error) {
          reject(new Error("Database connection error: " + error));
        }

        resolve(result[0].id_exists === 1);
      }
    );
  });
};
