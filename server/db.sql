PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS app_users (
    user_id TEXT PRIMARY KEY,
    user_email TEXT UNIQUE NOT NULL,
    user_password TEXT NOT NULL,
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_recipes (
    recipe_id TEXT PRIMARY KEY,
    recipe_name TEXT NOT NULL,
    cook_duration INTEGER NOT NULL,
    recipe_image TEXT,
    recipe_content TEXT NOT NULL,
    total_likes INTEGER DEFAULT 0,
    total_dislikes INTEGER DEFAULT 0,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_ingredients (
    ingredient_id TEXT PRIMARY KEY,
    ingredient_name TEXT UNIQUE NOT NULL,
    ingredient_amount INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS app_recipe_ingredients (
    recipe_ref TEXT,
    ingredient_ref TEXT,
    PRIMARY KEY (recipe_ref, ingredient_ref),
    FOREIGN KEY (recipe_ref) REFERENCES app_recipes(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_ref) REFERENCES app_ingredients(ingredient_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS app_user_recipe_links (
    user_ref TEXT,
    recipe_ref TEXT,
    marked_favorite BOOLEAN DEFAULT 0,
    has_liked BOOLEAN DEFAULT 0,
    has_disliked BOOLEAN DEFAULT 0,
    last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_ref, recipe_ref),
    FOREIGN KEY (user_ref) REFERENCES app_users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_ref) REFERENCES app_recipes(recipe_id) ON DELETE CASCADE
);
