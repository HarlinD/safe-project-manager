// database/migrations/007_create_features.js
exports.up = function(knex) {
  return knex.schema.createTable('features', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('epic_id');
    table.uuid('release_train_id').references('id').inTable('release_trains').onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.text('description');
    table.text('acceptance_criteria');
    table.integer('priority').defaultTo(0);
    table.string('status', 50).defaultTo('draft');
    table.string('effort_estimate', 50);
    table.integer('business_value').defaultTo(0);
    table.integer('time_criticality').defaultTo(0);
    table.integer('risk_reduction').defaultTo(0);
    table.integer('job_size').defaultTo(0);
    table.decimal('wsjf_score', 5, 2).defaultTo(0);
    table.uuid('assigned_to_team_id').references('id').inTable('teams');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('created_by').references('id').inTable('users');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('features');
};
