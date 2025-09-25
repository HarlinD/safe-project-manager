// database/seeds/005_release_trains.js
exports.seed = function(knex) {
  return knex('release_trains').del()
    .then(function () {
      return knex('release_trains').insert([
        {
          id: '550e8400-e29b-41d4-a716-446655440030',
          organization_id: '550e8400-e29b-41d4-a716-446655440020',
          name: 'RT-1 E-commerce',
          description: 'E-handelsplattform med fokus på användarupplevelse',
          rte_id: '550e8400-e29b-41d4-a716-446655440011',
          start_date: '2024-01-01',
          end_date: '2024-03-31',
          status: 'active',
          budget: 500000,
          spent: 425000,
          velocity_target: 40,
          current_velocity: 42,
          health_score: 8.5,
          created_by: '550e8400-e29b-41d4-a716-446655440010'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440031',
          organization_id: '550e8400-e29b-41d4-a716-446655440020',
          name: 'RT-2 Mobile App',
          description: 'Mobilapplikation för iOS och Android',
          rte_id: '550e8400-e29b-41d4-a716-446655440011',
          start_date: '2024-01-15',
          end_date: '2024-04-15',
          status: 'active',
          budget: 300000,
          spent: 280000,
          velocity_target: 35,
          current_velocity: 38,
          health_score: 7.8,
          created_by: '550e8400-e29b-41d4-a716-446655440010'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440032',
          organization_id: '550e8400-e29b-41d4-a716-446655440020',
          name: 'RT-3 Data Platform',
          description: 'Dataplattform för analytics och machine learning',
          rte_id: '550e8400-e29b-41d4-a716-446655440011',
          start_date: '2024-02-01',
          end_date: '2024-05-01',
          status: 'active',
          budget: 750000,
          spent: 682500,
          velocity_target: 45,
          current_velocity: 45,
          health_score: 9.1,
          created_by: '550e8400-e29b-41d4-a716-446655440010'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440033',
          organization_id: '550e8400-e29b-41d4-a716-446655440020',
          name: 'RT-4 Analytics',
          description: 'Analytics och rapportering',
          rte_id: '550e8400-e29b-41d4-a716-446655440011',
          start_date: '2024-01-01',
          end_date: '2024-03-31',
          status: 'active',
          budget: 200000,
          spent: 190000,
          velocity_target: 30,
          current_velocity: 28,
          health_score: 6.2,
          created_by: '550e8400-e29b-41d4-a716-446655440010'
        }
      ]);
    });
};
