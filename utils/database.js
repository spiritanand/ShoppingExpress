const mysql = require('mysql2');
const {createPool} = require('mysql2');

const pool = createPool({
  host: 'localhost',
  user: 'root',
  database: 'shopping_express',
  password: process.env.SQL_DB_PASSWORD,
});

module.exports = pool.promise();
