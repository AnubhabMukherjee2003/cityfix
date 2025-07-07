require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdminUser = async () => {
  try {
    const mongoUri = process.env.MONGODB_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/cityfix';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@cityfix.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@cityfix.com',
      password: 'admin123',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@cityfix.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdminUser();
