import * as Knex from 'knex';

declare module 'knex' {
  interface QueryBuilder {
    /**
     * Bulk upsert, defaults to bulk insert when no onConflict string is passed
     * @param data - Array of objects containing key value pairs
     * @param [onConflict] - ex: ON CONFLICT (col1, col2) UPDATE SET col3 = EXCLUDED.col3, updated_at = NOW()
     * @param [chunkSize] - optional, defaults to 1000
     */
    bulkUpsert<TRecord, TResult>(
      data: object[],
      onConflict?: string,
      chunkSize?: number
    ): QueryBuilder<TRecord, TResult>;
    /**
     * Bulk delete (using table variable for efficient deletion)
     * @param columns - Array of column names for delete condition
     * @param data - Array of objects containing key value pairs
     * @param [chunkSize] - optional, defaults to 1000
     */
    bulkDelete<TRecord, TResult>(
      data: object[],
      columns?: string[],
      chunkSize?: number
    ): QueryBuilder<TRecord, TResult>;
    /**
     * Bulk update (using table variable)
     * @param data - Array of objects containing key value pairs
     * @param [whereColumns] - Default ['id']. Array of column name
     * @param [updateSetStatement] - Customize SET '"col1" = "tmp"."col1"'
     * @param [chunkSize] - optional, defaults to 1000
     */
    bulkUpdate<TRecord, TResult>(
      data: object[],
      whereColumns?: string[],
      updateSetStatement?: string,
      chunkSize?: number
    ): QueryBuilder<TRecord, TResult>;
  }
}
