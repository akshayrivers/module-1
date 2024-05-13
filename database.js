const knex = require('knex');

// Knex configuration for PostgreSQL
const pg = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1720',
    database: 'postgres',
    ssl: false // Disable SSL for local development
  }
});

module.exports = pg;