// database/seeds/002_users.js
exports.seed = function(knex) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        {
          id: '550e8400-e29b-41d4-a716-446655440010',
          email: 'david@techcorp.se',
          password_hash: '$2b$10$example_hash_david',
          first_name: 'David',
          last_name: 'Andersson',
          preferences: JSON.stringify({ theme: 'light', notifications: true })
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440011',
          email: 'anna@techcorp.se',
          password_hash: '$2b$10$example_hash_anna',
          first_name: 'Anna',
          last_name: 'Johansson',
          preferences: JSON.stringify({ theme: 'dark', notifications: true })
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440012',
          email: 'marcus@techcorp.se',
          password_hash: '$2b$10$example_hash_marcus',
          first_name: 'Marcus',
          last_name: 'Svensson',
          preferences: JSON.stringify({ theme: 'light', notifications: false })
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440013',
          email: 'lisa@techcorp.se',
          password_hash: '$2b$10$example_hash_lisa',
          first_name: 'Lisa',
          last_name: 'Eriksson',
          preferences: JSON.stringify({ theme: 'dark', notifications: true })
        }
      ]);
    });
};
