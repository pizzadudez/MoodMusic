// @ts-nocheck
require('dotenv-safe').config({
  allowEmptyValues: true,
});
const Knex = require('knex');
const environment = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[environment];
const { chunkArray } = require('../src/utils');

// Extend Knex QueryBuilder with custom methods
Knex.QueryBuilder.extend('bulkUpsert', async function (
  data,
  onConflict = 'ON CONFLICT DO NOTHING',
  chunkSize = 1000
) {
  const isTransaction = this.client.transacting ? true : false;
  const runInTransaction = callback => {
    if (isTransaction) {
      return callback(this);
    }
    return this.client.transaction(callback);
  };

  return runInTransaction(async tr => {
    if (!isTransaction) {
      /* Local transaction does not have the initial QueryBuilder's table,
      we must add it manually. */
      tr = tr(this._single.table);
    }
    const chunks = chunkArray(data, chunkSize);
    for (const chunk of chunks) {
      console.log(chunk.length);
      await tr.client.raw('? ?', [tr.insert(chunk), tr.client.raw(onConflict)]);
    }
  });
});

module.exports = Knex(config);
