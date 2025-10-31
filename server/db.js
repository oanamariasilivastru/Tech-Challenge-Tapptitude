const Database = require('better-sqlite3');
const db = new Database('./my_database.db');
db.pragma('foreign_keys = ON');
module.exports = db;
