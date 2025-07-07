require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const issuesRouter = require('./routes/issues');
const authRouter = require('./routes/auth');
const noticesRouter = require('./routes/notices');

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

// Routes
app.use('/api/auth', authRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/notices', noticesRouter);

app.get('/', (req, res) => {
  res.json({ message: 'CityFix API Server' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;