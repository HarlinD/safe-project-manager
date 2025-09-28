// database/seeds/009_dashboard_metrics.js
exports.seed = function(knex) {
  return knex('dashboard_metrics').del()
    .then(function () {
      return knex('dashboard_metrics').insert([
        {
          id: '550e8400-e29b-41d4-a716-446655440060',
          organization_id: '550e8400-e29b-41d4-a716-446655440020',
          active_release_trains: 4,
          total_features: 12,
          critical_risks: 2,
          avg_team_health: 8.0,
          avg_velocity: 37.6
        }
      ]);
    });
};
