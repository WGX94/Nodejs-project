const knex = require('knex');
const dbConfig = require('./knexfile');
const environment = process.env.NODE_ENV || 'development';

const db = knex(dbConfig[environment]);

module.exports = db;