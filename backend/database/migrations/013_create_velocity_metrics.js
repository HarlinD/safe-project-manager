// database/migrations/013_create_velocity_metrics.js
exports.up = function(knex) {
  return knex.schema.createTable('velocity_metrics', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('team_id').references('id').inTable('teams').onDelete('CASCADE');
    table.uuid('sprint_id').references('id').inTable('sprints').onDelete('CASCADE');
    table.integer('planned_points').defaultTo(0);
    table.integer('completed_points').defaultTo(0);
    table.integer('committed_points').defaultTo(0);
    table.timestamp('measured_at').defaultTo(knex.fn.now());
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('velocity_metrics');
};
