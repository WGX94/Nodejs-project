const knex = require('knex')(require('../knexfile')['development']);

// Create
// async function createUser(name, surname, jobTitle, structure_id, team_id, score_id, liked_id, image, role, email, password) {
//   return knex('users').insert({
//     name,
//     surname,
//     jobTitle,
//     structure_id,
//     team_id,
//     score_id,
//     liked_id,
//     image,
//     role,
//     email,
//     password
//   });
// }
async function createUser(name, email, password) {
  return knex('users').insert({
    name,
    email,
    password
  });
}

// Read
async function getAllUsers() {
  return await knex.select().from('users');
}

async function getUserById(id) {
  return await knex('users').where({ id }).first();
}

async function getUserByName(name) {
  return await knex('users').where({ name }).first();
}

//get user by email
async function getUserByEmail(email) {
  return await knex('users').where({ email }).first();
}

//Update
async function updateUser(id, name, surname, jobTitle, structure_id, team_id, score_id, liked_id, image, role, email, password) {
  const updateData = {};

  if (name !== undefined) updateData.name = name;
  if (surname !== undefined) updateData.surname = surname;
  if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
  if (structure_id !== undefined) updateData.structure_id = structure_id;
  if (team_id !== undefined) updateData.team_id = team_id;
  if (score_id !== undefined) updateData.score_id = score_id;
  if (liked_id !== undefined) updateData.liked_id = liked_id;
  if (role !== undefined) updateData.role = role;
  if (image !== null) updateData.image = image; 
  if (email !== undefined) updateData.email = email;
  if (password !== undefined) updateData.password = password;

  if (Object.keys(updateData).length === 0) {
    throw new Error("Aucune donnée fournie pour la mise à jour");
  }

  return await knex('users').where({ id }).update(updateData);
}


// Delete
async function deleteUser(id) {
  const trx = await knex.transaction();
  
  try {
    await trx('reactions')
      .whereIn('messagePT_id', 
        trx('messagesPT').select('id').where('user_id', id)
      )
      .del();
    
    await trx('reactions').where('user_id', id).del();
    
    await trx('messagesPT').where('user_id', id).del();
    
    const deletedCount = await trx('users').where({ id }).del();
    
    await trx.commit();
    
    return deletedCount;
  } catch (error) {
    await trx.rollback();
    console.error('Erreur lors de la suppression en cascade:', error);
    throw error;
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByName,
  getUserByEmail
};
