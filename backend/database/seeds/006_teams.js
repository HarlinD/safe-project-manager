// database/seeds/006_teams.js
exports.seed = function(knex) {
  return knex('teams').del()
    .then(function () {
      return knex('teams').insert([
        {
          id: '550e8400-e29b-41d4-a716-446655440040',
          release_train_id: '550e8400-e29b-41d4-a716-446655440030',
          name: 'Frontend Team',
          description: 'React och TypeScript utveckling',
          team_lead_id: '550e8400-e29b-41d4-a716-446655440012',
          scrum_master_id: '550e8400-e29b-41d4-a716-446655440013',
          product_owner_id: '550e8400-e29b-41d4-a716-446655440012',
          capacity: 100,
          velocity: 42,
          health_score: 8.5
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440041',
          release_train_id: '550e8400-e29b-41d4-a716-446655440030',
          name: 'Backend Team',
          description: 'Node.js och PostgreSQL utveckling',
          team_lead_id: '550e8400-e29b-41d4-a716-446655440012',
          scrum_master_id: '550e8400-e29b-41d4-a716-446655440013',
          product_owner_id: '550e8400-e29b-41d4-a716-446655440012',
          capacity: 100,
          velocity: 38,
          health_score: 7.8
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440042',
          release_train_id: '550e8400-e29b-41d4-a716-446655440031',
          name: 'Mobile Team',
          description: 'iOS och Android utveckling',
          team_lead_id: '550e8400-e29b-41d4-a716-446655440012',
          scrum_master_id: '550e8400-e29b-41d4-a716-446655440013',
          product_owner_id: '550e8400-e29b-41d4-a716-446655440012',
          capacity: 100,
          velocity: 35,
          health_score: 8.2
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440043',
          release_train_id: '550e8400-e29b-41d4-a716-446655440032',
          name: 'Data Team',
          description: 'Data engineering och ML',
          team_lead_id: '550e8400-e29b-41d4-a716-446655440012',
          scrum_master_id: '550e8400-e29b-41d4-a716-446655440013',
          product_owner_id: '550e8400-e29b-41d4-a716-446655440012',
          capacity: 100,
          velocity: 45,
          health_score: 9.1
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440044',
          release_train_id: '550e8400-e29b-41d4-a716-446655440033',
          name: 'Analytics Team',
          description: 'Business intelligence och rapportering',
          team_lead_id: '550e8400-e29b-41d4-a716-446655440012',
          scrum_master_id: '550e8400-e29b-41d4-a716-446655440013',
          product_owner_id: '550e8400-e29b-41d4-a716-446655440012',
          capacity: 100,
          velocity: 28,
          health_score: 6.2
        }
      ]);
    });
};
