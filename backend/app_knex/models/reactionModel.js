const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createReaction(user_id, reaction, messagePT_id) {
  return await knex('Reactions').insert({ user_id, reaction, messagePT_id });
}

// Read
async function getAllReactions() {
  return await knex.select().from('Reactions');
}

async function toggleReaction(user_id, reaction, messagePT_id) {
  const existing = await knex('reactions')
    .where({ user_id, reaction, messagePT_id })
    .first();

  if (existing) {
    await knex('reactions').where({ id: existing.id }).del();
    return { toggled: false }; 
  } else {
    await knex('reactions').insert({ user_id, reaction, messagePT_id });
    return { toggled: true }; 
  }
}


async function getReactionById(id) {
  return await knex('Reactions').where({ id }).first();
}

// Update
async function updateReaction(id, newUserId, newReaction, newMessagePTId) {
  return await knex('Reactions').where({ id }).update({ user_id: newUserId, reaction: newReaction, messagePT_id: newMessagePTId });
}

// Delete
async function deleteReaction(id) {
  return await knex('Reactions').where({ id }).del();
}

module.exports = {
  createReaction,
  getAllReactions,
  getReactionById,
  updateReaction,
  deleteReaction,
  toggleReaction
};

