// database/migrations/005_create_release_trains.js
exports.up = function(knex) {
  return knex.schema.createTable('release_trains', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.text('description');
    table.uuid('rte_id').references('id').inTable('users');
    table.date('start_date');
    table.date('end_date');
    table.string('status', 50).defaultTo('planning');
    table.decimal('budget', 15, 2);
    table.decimal('spent', 15, 2).defaultTo(0);
    table.integer('velocity_target');
    table.integer('current_velocity');
    table.decimal('health_score', 3, 1).checkBetween([0, 10]);
    table.jsonb('settings').defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('created_by').references('id').inTable('users');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('release_trains');
};
