// database/migrations/006_create_epics.js
exports.up = function(knex) {
  return knex.schema.createTable('epics', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.text('description');
    table.text('business_value');
    table.text('acceptance_criteria');
    table.integer('priority').defaultTo(0);
    table.string('status', 50).defaultTo('draft');
    table.string('effort_estimate', 50);
    table.uuid('business_owner_id').references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('created_by').references('id').inTable('users');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('epics');
};
