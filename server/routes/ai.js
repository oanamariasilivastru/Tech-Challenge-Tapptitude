require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_NAME = "models/gemini-2.5-flash";
const db = new sqlite3.Database('./recipes.db');

function getFallbackRecipes(query) {
  const placeholder = "https://placehold.co/400x300/png?text=Recipe";
  return Array.from({ length: 5 }, (_, i) => ({
    recipe_id: `fallback-${Date.now()}-${i + 1}`,
    recipe_name: `${query} Recipe ${i + 1}`,
    cook_duration: 20,
    recipe_image: placeholder,
    recipe_content: JSON.stringify({
      ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
      instructions: ["Step 1", "Step 2", "Step 3"]
    })
  }));
}

async function fetchAIRecipes(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(`
      Generate exactly 5 recipes based on "${prompt}".
      Each recipe must include:
        - title (string)
        - cook_duration (integer, minutes)
        - image (string URL)
        - ingredients (array)
        - instructions (array)
      Return only a valid JSON array.
    `);
    const text = result.response.text();
    const clean = text.replace(/```json\n?|```\n?/g, '').trim();
    const jsonMatch = clean.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array detected");
    const parsed = JSON.parse(jsonMatch[0]);

    return parsed.map(r => ({
      recipe_id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      recipe_name: r.title,
      cook_duration: parseInt(r.cook_duration) || 20,
      recipe_image: r.image || "https://placehold.co/400x300/png?text=Recipe",
      recipe_content: JSON.stringify({
        ingredients: r.ingredients || [],
        instructions: r.instructions || []
      })
    }));
  } catch (err) {
    console.error("Gemini error:", err.message);
    return getFallbackRecipes(prompt);
  }
}

router.post('/recipes', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const recipes = await fetchAIRecipes(prompt);

    const insertStmt = db.prepare(`
      INSERT OR IGNORE INTO app_recipes 
      (recipe_id, recipe_name, cook_duration, recipe_image, recipe_content)
      VALUES (?, ?, ?, ?, ?)
    `);

    recipes.forEach(r => {
      insertStmt.run(
        r.recipe_id,
        r.recipe_name,
        r.cook_duration,
        r.recipe_image,
        r.recipe_content
      );
    });

    insertStmt.finalize();
    res.json({ recipes });
  } catch (err) {
    console.error("DB insert error:", err);
    res.status(500).json({ error: "Failed to save AI recipes", details: err.message });
  }
});

module.exports = router;
