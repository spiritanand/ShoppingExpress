const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'shopping_express',
  process.env.SQL_DB_USERNAME,
  process.env.SQL_DB_PASSWORD,
  {
    dialect: 'mysql',
    host: 'localhost',
  }
);

module.exports = sequelize;
