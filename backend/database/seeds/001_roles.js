// database/seeds/001_roles.js
exports.seed = function(knex) {
  return knex('roles').del()
    .then(function () {
      return knex('roles').insert([
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Portfolio Manager',
          description: 'Portföljansvarig - Övergripande ansvar för portföljen',
          permissions: JSON.stringify(['portfolio:read', 'portfolio:write', 'reports:read'])
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Release Train Engineer',
          description: 'RTE - Ansvarig för Release Train',
          permissions: JSON.stringify(['rt:read', 'rt:write', 'pi-planning:manage'])
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Product Owner',
          description: 'PO - Ansvarig för produktbacklog',
          permissions: JSON.stringify(['backlog:read', 'backlog:write', 'features:manage'])
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          name: 'Scrum Master',
          description: 'SM - Facilitator för team',
          permissions: JSON.stringify(['team:read', 'team:write', 'sprints:manage'])
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440005',
          name: 'Developer',
          description: 'Utvecklare',
          permissions: JSON.stringify(['stories:read', 'stories:write'])
        }
      ]);
    });
};
