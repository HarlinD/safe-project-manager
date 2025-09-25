// database/migrations/001_create_organizations.js
exports.up = function(knex) {
  return knex.schema.createTable('organizations', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name', 255).notNullable();
    table.text('description');
    table.jsonb('settings').defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('created_by');
    table.boolean('is_active').defaultTo(true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('organizations');
};
