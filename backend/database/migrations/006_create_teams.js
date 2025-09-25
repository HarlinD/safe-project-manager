// database/migrations/006_create_teams.js
exports.up = function(knex) {
  return knex.schema.createTable('teams', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('release_train_id').references('id').inTable('release_trains').onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.text('description');
    table.uuid('team_lead_id').references('id').inTable('users');
    table.uuid('scrum_master_id').references('id').inTable('users');
    table.uuid('product_owner_id').references('id').inTable('users');
    table.integer('capacity').defaultTo(100);
    table.integer('velocity').defaultTo(0);
    table.decimal('health_score', 3, 1).checkBetween([0, 10]);
    table.jsonb('settings').defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('teams');
};
