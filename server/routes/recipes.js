const express = require('express');
const db = require('../db');
const { authenticateToken } = require('./auth');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const recipes = db.prepare(`
    SELECT r.*,
           COALESCE(l.marked_favorite, 0) AS marked_favorite,
           COALESCE(l.has_liked, 0) AS has_liked,
           COALESCE(l.has_disliked, 0) AS has_disliked
    FROM app_recipes r
    LEFT JOIN app_user_recipe_links l
      ON r.recipe_id = l.recipe_ref AND l.user_ref = ?
  `).all(userId);
  res.json({ recipes });
});

router.post('/:recipeId/favorite', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const recipeId = req.params.recipeId;

  const recipeExists = db.prepare('SELECT 1 FROM app_recipes WHERE recipe_id = ?').get(recipeId);
  if (!recipeExists) return res.status(404).json({ error: 'Recipe not found' });

  db.prepare(`
    INSERT INTO app_user_recipe_links (user_ref, recipe_ref, marked_favorite)
    VALUES (?, ?, 1)
    ON CONFLICT(user_ref, recipe_ref)
    DO UPDATE SET marked_favorite = 1, last_modified = CURRENT_TIMESTAMP
  `).run(userId, recipeId);

  res.json({ message: 'Added to favorites' });
});

router.delete('/:recipeId/favorite', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const recipeId = req.params.recipeId;

  db.prepare(`
    UPDATE app_user_recipe_links
    SET marked_favorite = 0, last_modified = CURRENT_TIMESTAMP
    WHERE user_ref = ? AND recipe_ref = ?
  `).run(userId, recipeId);

  res.json({ message: 'Removed from favorites' });
});

router.post('/:recipeId/like', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const recipeId = req.params.recipeId;

  const recipeExists = db.prepare('SELECT 1 FROM app_recipes WHERE recipe_id = ?').get(recipeId);
  if (!recipeExists) return res.status(404).json({ error: 'Recipe not found' });

  db.prepare(`
    INSERT INTO app_user_recipe_links (user_ref, recipe_ref, has_liked, has_disliked)
    VALUES (?, ?, 1, 0)
    ON CONFLICT(user_ref, recipe_ref)
    DO UPDATE SET has_liked = 1, has_disliked = 0, last_modified = CURRENT_TIMESTAMP
  `).run(userId, recipeId);

  db.prepare('UPDATE app_recipes SET total_likes = total_likes + 1 WHERE recipe_id = ?').run(recipeId);
  res.json({ message: 'Recipe liked' });
});

router.post('/:recipeId/dislike', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const recipeId = req.params.recipeId;

  const recipeExists = db.prepare('SELECT 1 FROM app_recipes WHERE recipe_id = ?').get(recipeId);
  if (!recipeExists) return res.status(404).json({ error: 'Recipe not found' });

  db.prepare(`
    INSERT INTO app_user_recipe_links (user_ref, recipe_ref, has_liked, has_disliked)
    VALUES (?, ?, 0, 1)
    ON CONFLICT(user_ref, recipe_ref)
    DO UPDATE SET has_liked = 0, has_disliked = 1, last_modified = CURRENT_TIMESTAMP
  `).run(userId, recipeId);

  db.prepare('UPDATE app_recipes SET total_dislikes = total_dislikes + 1 WHERE recipe_id = ?').run(recipeId);
  res.json({ message: 'Recipe disliked' });
});

module.exports = router;
