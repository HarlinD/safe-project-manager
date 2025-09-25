// database/migrations/004_create_user_organization_roles.js
exports.up = function(knex) {
  return knex.schema.createTable('user_organization_roles', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
    table.uuid('role_id').references('id').inTable('roles').onDelete('CASCADE');
    table.timestamp('assigned_at').defaultTo(knex.fn.now());
    table.uuid('assigned_by').references('id').inTable('users');
    table.unique(['user_id', 'organization_id', 'role_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_organization_roles');
};
