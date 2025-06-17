require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const issuesRouter = require('./routes/issues');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/cityfix';
mongoose.connect(mongoUri).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.use('/api/issues', issuesRouter);
app.get('/', (req, res) => {
  res.json({ message: 'CityFix API Server' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;