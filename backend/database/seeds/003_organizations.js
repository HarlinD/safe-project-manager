// database/seeds/003_organizations.js
exports.seed = function(knex) {
  return knex('organizations').del()
    .then(function () {
      return knex('organizations').insert([
        {
          id: '550e8400-e29b-41d4-a716-446655440020',
          name: 'TechCorp AB',
          description: 'Teknologiföretag med fokus på e-handel och mobilappar',
          settings: JSON.stringify({ timezone: 'Europe/Stockholm', currency: 'SEK' }),
          created_by: '550e8400-e29b-41d4-a716-446655440010'
        }
      ]);
    });
};
