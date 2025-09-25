// database/seeds/008_risks.js
exports.seed = function(knex) {
  return knex('risks').del()
    .then(function () {
      return knex('risks').insert([
        {
          id: '550e8400-e29b-41d4-a716-446655440060',
          organization_id: '550e8400-e29b-41d4-a716-446655440020',
          release_train_id: '550e8400-e29b-41d4-a716-446655440030',
          title: 'Teknisk skuld i legacy-kod',
          description: 'Gammal kod som behöver refaktoreras',
          category: 'Technical',
          probability: 'High',
          impact: 'Medium',
          risk_score: 6,
          status: 'identified',
          mitigation_plan: 'Planera refaktorering i kommande sprints',
          owner_id: '550e8400-e29b-41d4-a716-446655440011',
          due_date: '2024-02-15',
          created_by: '550e8400-e29b-41d4-a716-446655440010'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440061',
          organization_id: '550e8400-e29b-41d4-a716-446655440020',
          release_train_id: '550e8400-e29b-41d4-a716-446655440031',
          title: 'Resursbrist för mobilutveckling',
          description: 'Brist på iOS/Android utvecklare',
          category: 'Resource',
          probability: 'Medium',
          impact: 'High',
          risk_score: 6,
          status: 'assessed',
          mitigation_plan: 'Rekrytera externa konsulter',
          owner_id: '550e8400-e29b-41d4-a716-446655440011',
          due_date: '2024-01-30',
          created_by: '550e8400-e29b-41d4-a716-446655440010'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440062',
          organization_id: '550e8400-e29b-41d4-a716-446655440020',
          release_train_id: '550e8400-e29b-41d4-a716-446655440032',
          title: 'GDPR-compliance för datahantering',
          description: 'Risk för GDPR-överträdelser',
          category: 'Business',
          probability: 'Low',
          impact: 'Critical',
          risk_score: 4,
          status: 'mitigated',
          mitigation_plan: 'Implementerat datahanteringspolicy',
          owner_id: '550e8400-e29b-41d4-a716-446655440011',
          due_date: '2024-01-15',
          created_by: '550e8400-e29b-41d4-a716-446655440010'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440063',
          organization_id: '550e8400-e29b-41d4-a716-446655440020',
          release_train_id: '550e8400-e29b-41d4-a716-446655440033',
          title: 'Budgetöverskridning',
          description: 'Risk för att överskrida budget',
          category: 'Business',
          probability: 'Medium',
          impact: 'Medium',
          risk_score: 4,
          status: 'identified',
          mitigation_plan: 'Övervaka utgifter närmare',
          owner_id: '550e8400-e29b-41d4-a716-446655440011',
          due_date: '2024-03-01',
          created_by: '550e8400-e29b-41d4-a716-446655440010'
        }
      ]);
    });
};
