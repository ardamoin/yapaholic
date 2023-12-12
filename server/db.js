const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config({
  path: "./.env",
});

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "root",
    database: "yapaholic",
    port: 8889,
  } || process.env.MYSQL_URL
);

module.exports = db;
