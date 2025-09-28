// 015_create_dashboard_metrics.js
exports.up = function(knex) {
  return knex.schema.createTable('dashboard_metrics', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('organization_id').notNullable();
    table.integer('active_release_trains').defaultTo(0);
    table.integer('total_features').defaultTo(0);
    table.integer('critical_risks').defaultTo(0);
    table.decimal('avg_team_health', 3, 1).defaultTo(0);
    table.decimal('avg_velocity', 5, 2).defaultTo(0);
    table.timestamps(true, true);
    
    table.foreign('organization_id').references('id').inTable('organizations');
    table.index(['organization_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('dashboard_metrics');
};
