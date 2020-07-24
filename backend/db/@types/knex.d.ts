import * as Knex from 'knex';

declare module 'knex' {
  interface QueryBuilder {
    /**
     * Bulk upsert, defaults to bulk insert when no onConflict string is passed
     * @param data - Array of objects containing key value pairs
     * @param {string=} [onConflict] - ex: ON CONFLICT (col1, col2) UPDATE SET col3 = EXCLUDED.col3, updated_at = NOW()
     * @param [chunkSize] - optional, defaults to 1000
     */
    bulkUpsert<TRecord, TResult>(
      data: object[],
      onConflict?: string,
      chunkSize?: number
    ): QueryBuilder<TRecord, TResult>;
    bulkDelete<TRecord, TResult>(
      columns: string[],
      data: object[],
      chunkSize?: number
    ): QueryBuilder<TRecord, TResult>;
  }
}
