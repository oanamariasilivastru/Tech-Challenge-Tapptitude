require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');
const recipesRouter = require('./routes/recipes');
const aiRouter = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/ai', aiRouter);

app.get('/', (req, res) => res.json({ message: 'Recipe API with JWT + AI' }));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
