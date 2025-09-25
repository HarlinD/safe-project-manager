// database/migrations/012_create_sprints.js
exports.up = function(knex) {
  return knex.schema.createTable('sprints', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('team_id').references('id').inTable('teams').onDelete('CASCADE');
    table.uuid('program_increment_id');
    table.string('name', 255).notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.string('status', 50).defaultTo('planning');
    table.text('goal');
    table.integer('capacity').defaultTo(0);
    table.integer('committed_points').defaultTo(0);
    table.integer('completed_points').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('sprints');
};
