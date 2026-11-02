require('dotenv').config();
const db = require('mysql');

const pool = db.createPool({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  port: process.env.DBPORT,
  database: process.env.DBNAME,
  connectionLimit: 10,
});

module.exports = pool;