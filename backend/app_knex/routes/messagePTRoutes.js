const express = require('express');
const router = express.Router();
const messageModel = require('../models/messagePTModel');
const reactionModel = require('../models/reactionModel');
const userModel = require('../models/userModel');
const knex = require('knex');
const knexfile = require('../knexfile');
const db = knex(knexfile.development);


// Middleware pour simuler un utilisateur connecté (à remplacer par auth réelle)
async function getUserFromRequest(req) {
  const userId = req.header('x-user-id'); // Simulé
  return await userModel.getUserById(userId);
}

// Créer un message (rôle "A" uniquement)
router.post('/messagesPT', async (req, res) => {
  try {
    const { user_id, message } = req.body;
    if (!user_id || !message) {
      return res.status(400).json({ error: "user_id et message sont requis" });
    }

    await db('messagesPT').insert({
      user_id,
      message,
      date: new Date().toISOString()
    });

    res.status(201).json({ message: 'Message créé avec succès' });
  } catch (err) {
    console.error("Erreur dans POST /messagesPT :", err);
    res.status(500).json({ error: err.message });
  }
});

// Obtenir tous les messages
router.get('/messagesPT', async (req, res) => {
  try {
    const messages = await messageModel.getMessages();
    res.json(messages);
  } catch (error) {
    console.error('Erreur dans GET /messagesPT :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
});

// Obtenir un message par ID de l'utilisateur
router.get('/messagesPT/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const message = await messageModel.getMessagesByUserId(id);
    if (!message) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }
    res.json(message);
  } catch (error) {
    console.error('Erreur dans GET /messagesPT/:id :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du message' });
  }
});

// Modifier un message (seulement l’auteur)
router.put('/messagesPT/:id', async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  
  try {
    // Récupérer le message pour vérifier qu'il existe et obtenir l'auteur
    const existingMessage = await messageModel.getMessagePTById(id);
    if (!existingMessage) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    // Mettre à jour le message
    await messageModel.updateMessagePT(id, message);
    
    // Retourner le message mis à jour
    const updatedMessage = await messageModel.getMessagePTById(id);
    res.json({ 
      message: 'Message mis à jour avec succès',
      data: updatedMessage 
    });
  } catch (error) {
    console.error('Erreur lors de la modification du message:', error);
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un message (seulement l’auteur)
router.delete('/messagesPT/:id', async (req, res) => {
  const { id } = req.params;
  // const user = await getUserFromRequest(req);

  //const message = await messageModel.getMessagePTById(id);
  // if (!message || message.user_id !== user.id) {
  //   return res.status(403).json({ error: 'Non autorisé' });
  // }

  try {
    await messageModel.deleteMessagePT(id);
    res.json({ message: 'Message supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Réagir à un message (tout le monde peut)
router.post('/messagesPT/:id/reactions', async (req, res) => {
  const { id } = req.params;
  const { emoji } = req.body;
  const user = await getUserFromRequest(req);

  try {
    await reactionModel.createReaction(id, user.id, emoji);
    res.status(201).json({ message: 'Réaction ajoutée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
