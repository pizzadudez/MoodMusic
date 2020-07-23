exports.up = function (knex) {
  return knex.schema
    .createTable('users', table => {
      table.string('id').primary().unique().notNullable();
      table.string('refresh_token').notNullable();
      table.timestamp('refreshed_at');
      table.timestamp('synced_at');

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    .createTable('labels', table => {
      table.increments('id');
      table
        .enum('type', ['genre', 'subgenre', 'mood'], {
          useNative: true,
          enumName: 'label_type',
        })
        .notNullable();
      table.string('name').notNullable();
      table.string('color');
      table.string('verbose');
      table.string('suffix');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

      table.integer('parent_id').references('labels.id').defaultTo(null);
      table.string('user_id').references('users.id').notNullable();
    })
    .createTable('playlists', table => {
      table.string('id').primary().unique().notNullable();
      table
        .enum('type', ['untracked', 'mix', 'label', 'deleted'], {
          useNative: true,
          enumName: 'playlist_type',
        })
        .notNullable()
        .defaultTo('untracked');
      table.string('name').notNullable();
      table.string('description');
      table.integer('track_count');
      table.string('snapshot_id');
      table.boolean('updates').notNullable().defaultTo(true);
      table.timestamp('added_at').notNullable().defaultTo(knex.fn.now());

      table.integer('label_id').references('labels.id').defaultTo(null);
      table.string('user_id').references('users.id').notNullable();
    })
    .createTable('albums', table => {
      table.string('id').primary().unique().notNullable();
      table.string('name').notNullable();
      table.string('small');
      table.string('medium');
      table.string('large');
    })
    .createTable('tracks', table => {
      table.string('id').primary().unique().notNullable();
      table.string('name').notNullable();
      table.string('artist').notNullable();

      table.string('album_id').references('albums.id').notNullable();
    })
    .createTable('tracks_users', table => {
      table.string('track_id').references('tracks.id').notNullable();
      table.string('user_id').references('users.id').notNullable();
      table.boolean('liked').defaultTo(false);
      table.integer('rating').defaultTo(0);
      table.timestamp('added_at').notNullable().defaultTo(knex.fn.now());

      table.primary(['track_id', 'user_id']);
    })
    .createTable('tracks_playlists', table => {
      table.string('track_id').references('tracks.id').notNullable();
      table.string('playlist_id').references('playlists.id').notNullable();
      table.integer('position').defaultTo(null);
      table.timestamp('added_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

      table.primary(['track_id', 'playlist_id']);
    })
    .createTable('tracks_labels', table => {
      table.string('track_id').references('tracks.id').notNullable();
      table.integer('label_id').references('labels.id').notNullable();
      table.timestamp('added_at').notNullable().defaultTo(knex.fn.now());

      table.primary(['track_id', 'label_id']);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('tracks_labels')
    .dropTable('tracks_playlists')
    .dropTable('tracks_users')
    .dropTable('tracks')
    .dropTable('albums')
    .dropTable('playlists')
    .dropTable('labels')
    .dropTable('users')
    .raw(`DROP TYPE IF EXISTS label_type`)
    .raw(`DROP TYPE IF EXISTS playlist_type`);
};
