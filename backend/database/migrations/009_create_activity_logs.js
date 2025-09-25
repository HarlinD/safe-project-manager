// database/migrations/009_create_activity_logs.js
exports.up = function(knex) {
  return knex.schema.createTable('activity_logs', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('entity_type', 100);
    table.uuid('entity_id');
    table.string('action', 100);
    table.text('description');
    table.jsonb('metadata').defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('activity_logs');
};
