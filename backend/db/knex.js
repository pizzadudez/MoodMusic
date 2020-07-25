// @ts-nocheck
require('dotenv-safe').config({
  allowEmptyValues: true,
});
const Knex = require('knex');
const environment = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[environment];
const {
  chunkArray,
  generateValueBindings,
  getPGDataTypes,
} = require('../src/utils');

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
    /* Local transaction does not have the initial QueryBuilder's table,
    we must add it manually. */
    if (!isTransaction) {
      tr = tr(this._single.table);
    }
    const chunks = chunkArray(data, chunkSize);
    for (const chunk of chunks) {
      await tr.client.raw('? ?', [tr.insert(chunk), tr.client.raw(onConflict)]);
    }
  });
});
Knex.QueryBuilder.extend('bulkDelete', async function (
  columns,
  data,
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
    const tableName = this._single.table;
    const columnNames = columns.join(', ');
    const whereConditions = columns
      .map(c => `${tableName}.${c}::text = tmp.${c}::text`)
      .join(' AND ');

    const chunks = chunkArray(data, chunkSize);
    for (const chunk of chunks) {
      const valueBindings = generateValueBindings(columns.length, chunk.length);
      const values = chunk.map(el => columns.map(c => el[c])).flat();
      const stmt = `DELETE FROM ${tableName} 
        USING (VALUES ${valueBindings}) AS tmp(${columnNames})
        WHERE ${whereConditions}`;
      await tr.client.raw(stmt, values);
    }
  });
});
Knex.QueryBuilder.extend('bulkUpdate', async function (
  data,
  whereColumns = ['id'],
  updateSetStatement = undefined,
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
    const tableName = this._single.table;
    const columns = Object.keys(data[0]);
    const columnDataTypes = getPGDataTypes(data[0]);
    const columnNames = columns.join(', ');
    const whereCondition = whereColumns
      .map(c => `"${tableName}"."${c}" = "tmp"."${c}"::${columnDataTypes[c]}`)
      .join(' AND ');
    if (!updateSetStatement) {
      const setColumns = columns.filter(c => !whereColumns.includes(c));
      updateSetStatement = setColumns
        .map(c => `"${c}" = "tmp"."${c}"::${columnDataTypes[c]}`)
        .join(', ');
    }

    const chunks = chunkArray(data, chunkSize);
    for (const chunk of chunks) {
      const valueBindings = generateValueBindings(columns.length, chunk.length);
      const values = chunk.map(el => columns.map(c => el[c])).flat();
      const stmt = `UPDATE ${tableName} SET ${updateSetStatement}
        FROM (VALUES ${valueBindings}) AS tmp(${columnNames}) 
        WHERE ${whereCondition}`;
      await tr.client.raw(stmt, values);
    }
  });
});

module.exports = Knex(config);
