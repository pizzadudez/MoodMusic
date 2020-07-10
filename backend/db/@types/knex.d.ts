import * as Knex from 'knex';

declare module 'knex' {
  interface QueryBuilder {
    /**bulk update brah */
    bulkUpdate<TRecord, TResult>(value: string): QueryBuilder<TRecord, TResult>;
    bulkTest<TRecord, TResult>(value: string): QueryBuilder<TRecord, TResult>;
  }
}
