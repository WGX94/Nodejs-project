const db = require('../db'); 

module.exports = {
  async getLikedByUser(userId) {
    return db('liked')
      .join('games', 'liked.game_id', 'games.id')
      .join('categories', 'games.category_id', 'categories.id')
      .where('liked.user_id', userId)
      .select(
        'games.id',
        'games.name',
        'categories.name as category_name',
        'games.image'
      );
  },

  async addLiked(userId, gameId) {
    const exists = await db('liked')
      .where({ user_id: userId, game_id: gameId })
      .first();
    if (!exists) {
      return db('liked').insert({ user_id: userId, game_id: gameId });
    }
    return null;
  },

  async removeLiked(userId, gameId) {
    return db('liked')
      .where({ user_id: userId, game_id: gameId })
      .del();
  }
};
