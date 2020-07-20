require('dotenv-safe').config({
  allowEmptyValues: true,
});

const environment = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[environment];
const Knex = require('knex');
const { chunkArray } = require('../src/utils');

// Extend Knex with custom methods
// @ts-ignore
Knex.QueryBuilder.extend('bulkUpsert', async function (
  data,
  onConflict = 'ON CONFLICT DO NOTHING',
  chunkSize = 1000
) {
  const chunks = chunkArray(data, chunkSize);
  for (const chunk of chunks) {
    await this.client.raw('? ?', [
      this.insert(chunk),
      this.client.raw(onConflict),
    ]);
  }
});
// @ts-ignore
Knex.QueryBuilder.extend('bulkInsert', async function (data, chunkSize = 1000) {
  const chunks = chunkArray(data, chunkSize);
  for (const chunk of chunks) {
    await this.client.raw('? ON CONFLICT DO NOTHING', [this.insert(chunk)]);
  }
});

module.exports = Knex(config);
