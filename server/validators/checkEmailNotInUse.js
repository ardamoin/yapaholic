const db = require("../db");

const emailExistsInDb = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT EXISTS ( SELECT 1 FROM users WHERE email = ? ) AS email_exists",
      [email],
      (error, result) => {
        if (error) {
          reject(new Error("Database connection error: " + error));
        }

        resolve(result[0].email_exists === 1);
      }
    );
  });
};

module.exports = (email) => {
  return emailExistsInDb(email)
    .then((result) => {
      return !result;
    })
    .catch((error) => {
      return new Error(error);
    });
};
