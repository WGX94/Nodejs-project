const knex = require('knex')(require('../knexfile')['development']);
const db = require('../db')
// Create
async function createMessagePT(message, date) {
  return await knex('MessagePTs').insert({ message, date });
}

// Read
async function getAllMessagesPTs() {
  return await knex.select().from('MessagesPT');
}

async function getMessagesByUserId(userId) {
  try {
    const messages = await db('messagesPT as m')
      .select(
        'm.id',
        'm.message',
        'm.date',
        'u.name as senderName',
        's.name as structure',
        's.country'
      )
      .leftJoin('users as u', 'm.user_id', 'u.id')
      .leftJoin('structures as s', 'u.structure_id', 's.id')
      .where('m.user_id', userId)
      .orderBy('m.date', 'desc');

    const messageIds = messages.map(msg => msg.id);

    const reactions = await db('reactions as r')
      .whereIn('r.messagePT_id', messageIds)
      .select('r.id', 'r.reaction', 'r.user_id', 'r.messagePT_id');

    const messagesWithReactions = messages.map(msg => ({
      ...msg,
      reactions: reactions.filter(r => r.messagePT_id === msg.id)
    }));

    return messagesWithReactions;
  } catch (error) {
    console.error('Erreur dans getMessagesByUserId :', error);
    throw new Error("Erreur lors de la récupération des messages de l'utilisateur");
  }
}

async function getMessages() {
  try {
    const messages = await db('messagesPT as m')
      .select(
        'm.id',
        'm.message',
        'm.date',
        'u.name as senderName',
        's.name as structure',
        's.country'
      )
      .leftJoin('users as u', 'm.user_id', 'u.id')
      .leftJoin('structures as s', 'u.structure_id', 's.id')
      .orderBy('m.date', 'desc');

    const messageIds = messages.map(msg => msg.id);

    const reactions = await db('reactions as r')
      .whereIn('r.messagePT_id', messageIds)
      .select('r.id', 'r.reaction', 'r.user_id', 'r.messagePT_id');

    const messagesWithReactions = messages.map(msg => ({
      ...msg,
      reactions: reactions.filter(r => r.messagePT_id === msg.id)
    }));

    return messagesWithReactions;
  } catch (error) {
    console.error('Erreur dans getMessages :', error);
    throw new Error("Erreur lors de la récupération des messages");
  }
}

async function getMessagePTById(id) {
  return await knex('MessagesPT').where({ id }).first();
}


// Update
async function updateMessagePT(id, newMessage, newDate) {
  return await knex('MessagesPT').where({ id }).update({ message: newMessage, date: newDate });
}

// Delete
async function deleteMessagePT(id) {
  const trx = await knex.transaction();
  
  try {
    await trx('reactions').where('messagePT_id', id).del();
    
    const deletedCount = await trx('messagesPT').where({ id }).del();
    
    await trx.commit();
    
    return deletedCount;
  } catch (error) {
    await trx.rollback();
    console.error('Erreur lors de la suppression du message:', error);
    throw error;
  }
}

module.exports = {
  createMessagePT,
  getAllMessagesPTs,
  getMessagePTById,
  updateMessagePT,
  deleteMessagePT,
  getMessagesByUserId,
  getMessages
};

