require('dotenv-safe').config({
  allowEmptyValues: true,
});

const environment = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[environment];
const Knex = require('knex');

// Extend Knex with custom methods
Knex.QueryBuilder.extend('bulkUpdate', function (value) {
  return this.select(value);
});
Knex.QueryBuilder.extend('bulkTest', function (value) {
  return this.select(value);
});

module.exports = Knex(config);
