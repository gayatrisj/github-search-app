// index.js
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB connection
mongoose.connect('mongodb+srv://sivaji:19MG1A0448@cluster0.2ub8jnh.mongodb.net/GITHUB_SEARCH?retryWrites=true', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// MongoDB Schema
const repositorySchema = new mongoose.Schema({
  name: String,
  full_name: String,
  // Add other fields as needed
});

const Repository = mongoose.model('Repository', repositorySchema);

// Express middleware
app.use(cors());
app.use(express.json());

// Route to search repositories
app.get('/api/search', async (req, res) => {
  try {
    const { technology } = req.query;
    // Use GitHub API to search repositories
    const response = await axios.get(`https://api.github.com/search/repositories?q=${technology}`);
    const repositories = response.data.items;

    // Save repositories to MongoDB
    await Repository.insertMany(repositories);

    res.json(repositories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch top users
app.get('/api/top-users', async (req, res) => {
  try {
    const { repository } = req.query;
    // Implement logic to determine top users based on the repository
    // For now, let's return a dummy response
    const topUsers = ['user1', 'user2', 'user3'];
    res.json(topUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
