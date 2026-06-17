const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust path if needed

const seedUser = async () => {
  try {
    const uri = 'mongodb://127.0.0.1:27017/war_economic_impact';
    console.log('Connecting to database:', uri);
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    const existingUser = await User.findOne({ email: 'admin@wareconomics.com' });
    if (existingUser) {
        console.log('User already exists');
        process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const newUser = new User({
        username: 'admin',
        email: 'admin@wareconomics.com',
        password: hashedPassword,
        role: 'admin'
    });

    await newUser.save();
    console.log('Admin user created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding user:', error);
    process.exit(1);
  }
};

seedUser();
