const express = require('express');
const mongoose = require('mongoose'); // Replace with 'pg' for PostgreSQL
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (or PostgreSQL)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Database connection error', err));

// Set up routes (placeholders)
app.get('/', (req, res) => {
  res.send('Task Manager API');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
