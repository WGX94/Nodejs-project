// db.js - Fichier pour gérer les opérations CRUD avec Knex
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
  // Construire un objet updateData en ne mettant que les champs définis
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

// async function updateUser(id, name, role, email, password) {
//   const updateData = {};

//   if (name !== undefined) updateData.name = name;
//   if (email !== undefined) updateData.email = email;
//   if (password !== undefined) updateData.password = password;
//   if (role !== undefined) updateData.role = role;

//   if (Object.keys(updateData).length === 0) {
//     throw new Error("Aucune donnée fournie pour la mise à jour");
//   }

//   return await knex('users').where({ id }).update(updateData);
// }

// Delete
async function deleteUser(id) {
  // Supprimer d'abord les réactions liées aux messages de l'utilisateur
  await knex('reactions')
    .whereIn('messagePT_id', 
      knex('messagesPT').select('id').where('user_id', id)
    )
    .del();
  
  // Supprimer les réactions effectuées par l'utilisateur
  await knex('reactions').where('user_id', id).del();
  
  // Supprimer les messages de l'utilisateur
  await knex('messagesPT').where('user_id', id).del();
  
  // Supprimer l'utilisateur
  return await knex('users').where({ id }).del();
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
