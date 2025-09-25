// database/migrations/003_create_roles.js
exports.up = function(knex) {
  return knex.schema.createTable('roles', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name', 100).notNullable();
    table.text('description');
    table.jsonb('permissions').defaultTo('[]');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('roles');
};
