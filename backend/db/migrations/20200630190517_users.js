exports.up = function (knex) {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('spotify_id');
    table.string('refresh_token');
    table.datetime('latest_refresh');
    table.datetime('latest_sync');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    table.unique('spotify_id');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
