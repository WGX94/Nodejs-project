const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createToken(token, email) {
  return await knex('tokens').insert({token, email});
}

// Read
async function getAllTokens() {
  return await knex.select().from('tokens');
}

async function getTokenById(id) {
  return await knex('tokens').where({ id }).first();
}


// Delete
async function deleteToken(token) {
  return await knex('tokens').where({ token }).del();
}

module.exports = {
  createToken,
  getAllTokens,
  getTokenById,
  deleteToken
};

