// database/seeds/007_features.js
exports.seed = function(knex) {
  return knex('features').del()
    .then(function () {
      return knex('features').insert([
        {
          id: '550e8400-e29b-41d4-a716-446655440050',
          release_train_id: '550e8400-e29b-41d4-a716-446655440030',
          name: 'User Authentication',
          description: 'Säker inloggning och användarhantering',
          acceptance_criteria: 'Användare kan logga in, registrera sig och återställa lösenord',
          priority: 1,
          status: 'completed',
          effort_estimate: 'Large',
          business_value: 8,
          time_criticality: 7,
          risk_reduction: 6,
          job_size: 5,
          wsjf_score: 4.2,
          assigned_to_team_id: '550e8400-e29b-41d4-a716-446655440040',
          created_by: '550e8400-e29b-41d4-a716-446655440010'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440051',
          release_train_id: '550e8400-e29b-41d4-a716-446655440030',
          name: 'Product Catalog',
          description: 'Produktkatalog med sökfunktion',
          acceptance_criteria: 'Användare kan söka och filtrera produkter',
          priority: 2,
          status: 'in-progress',
          effort_estimate: 'Extra Large',
          business_value: 9,
          time_criticality: 8,
          risk_reduction: 5,
          job_size: 8,
          wsjf_score: 2.75,
          assigned_to_team_id: '550e8400-e29b-41d4-a716-446655440040',
          created_by: '550e8400-e29b-41d4-a716-446655440010'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440052',
          release_train_id: '550e8400-e29b-41d4-a716-446655440031',
          name: 'Mobile Push Notifications',
          description: 'Push-notifikationer för mobilappar',
          acceptance_criteria: 'Användare får notifikationer om nya produkter och erbjudanden',
          priority: 3,
          status: 'approved',
          effort_estimate: 'Medium',
          business_value: 7,
          time_criticality: 6,
          risk_reduction: 4,
          job_size: 3,
          wsjf_score: 5.67,
          assigned_to_team_id: '550e8400-e29b-41d4-a716-446655440042',
          created_by: '550e8400-e29b-41d4-a716-446655440010'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440053',
          release_train_id: '550e8400-e29b-41d4-a716-446655440032',
          name: 'Real-time Analytics',
          description: 'Realtidsanalys av användarbeteende',
          acceptance_criteria: 'Dashboard visar realtidsdata om användaraktivitet',
          priority: 4,
          status: 'draft',
          effort_estimate: 'Large',
          business_value: 8,
          time_criticality: 5,
          risk_reduction: 7,
          job_size: 6,
          wsjf_score: 3.33,
          assigned_to_team_id: '550e8400-e29b-41d4-a716-446655440043',
          created_by: '550e8400-e29b-41d4-a716-446655440010'
        }
      ]);
    });
};
