exports.up = function (knex) {
  return knex.schema.createTable('users', table => {
    table.string('id', 255).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
