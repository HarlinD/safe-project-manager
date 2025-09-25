// database/migrations/008_create_risks.js
exports.up = function(knex) {
  return knex.schema.createTable('risks', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
    table.uuid('release_train_id').references('id').inTable('release_trains').onDelete('CASCADE');
    table.string('title', 255).notNullable();
    table.text('description');
    table.string('category', 100);
    table.string('probability', 50);
    table.string('impact', 50);
    table.integer('risk_score').defaultTo(0);
    table.string('status', 50).defaultTo('identified');
    table.text('mitigation_plan');
    table.uuid('owner_id').references('id').inTable('users');
    table.date('due_date');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('created_by').references('id').inTable('users');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('risks');
};
