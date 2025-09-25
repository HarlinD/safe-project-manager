// database/migrations/011_create_user_stories.js
exports.up = function(knex) {
  return knex.schema.createTable('user_stories', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('feature_id').references('id').inTable('features').onDelete('CASCADE');
    table.uuid('team_id').references('id').inTable('teams').onDelete('CASCADE');
    table.string('title', 255).notNullable();
    table.text('description');
    table.text('acceptance_criteria');
    table.integer('story_points');
    table.integer('priority').defaultTo(0);
    table.string('status', 50).defaultTo('draft');
    table.uuid('sprint_id');
    table.uuid('assignee_id').references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('created_by').references('id').inTable('users');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_stories');
};
