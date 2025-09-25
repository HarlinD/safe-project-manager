// database/migrations/014_create_team_health_surveys.js
exports.up = function(knex) {
  return knex.schema.createTable('team_health_surveys', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('team_id').references('id').inTable('teams').onDelete('CASCADE');
    table.date('survey_date').notNullable();
    table.decimal('happiness_score', 3, 1).checkBetween([0, 10]);
    table.decimal('communication_score', 3, 1).checkBetween([0, 10]);
    table.decimal('collaboration_score', 3, 1).checkBetween([0, 10]);
    table.decimal('technical_debt_score', 3, 1).checkBetween([0, 10]);
    table.decimal('overall_score', 3, 1);
    table.text('comments');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by').references('id').inTable('users');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('team_health_surveys');
};
