// database/seeds/004_user_organization_roles.js
exports.seed = function(knex) {
  return knex('user_organization_roles').del()
    .then(function () {
      return knex('user_organization_roles').insert([
        {
          user_id: '550e8400-e29b-41d4-a716-446655440010',
          organization_id: '550e8400-e29b-41d4-a716-446655440020',
          role_id: '550e8400-e29b-41d4-a716-446655440001',
          assigned_by: '550e8400-e29b-41d4-a716-446655440010'
        },
        {
          user_id: '550e8400-e29b-41d4-a716-446655440011',
          organization_id: '550e8400-e29b-41d4-a716-446655440020',
          role_id: '550e8400-e29b-41d4-a716-446655440002',
          assigned_by: '550e8400-e29b-41d4-a716-446655440010'
        },
        {
          user_id: '550e8400-e29b-41d4-a716-446655440012',
          organization_id: '550e8400-e29b-41d4-a716-446655440020',
          role_id: '550e8400-e29b-41d4-a716-446655440003',
          assigned_by: '550e8400-e29b-41d4-a716-446655440010'
        },
        {
          user_id: '550e8400-e29b-41d4-a716-446655440013',
          organization_id: '550e8400-e29b-41d4-a716-446655440020',
          role_id: '550e8400-e29b-41d4-a716-446655440004',
          assigned_by: '550e8400-e29b-41d4-a716-446655440010'
        }
      ]);
    });
};
