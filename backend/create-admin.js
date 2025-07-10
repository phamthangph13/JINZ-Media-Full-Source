const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect('mongodb://localhost:27017/jinzmedia');

async function createTestAdmin() {
  try {
    const adminExists = await User.findOne({ email: 'admin@jinzmedia.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      console.log('Email: admin@jinzmedia.com');
      console.log('Password: admin123');
      mongoose.connection.close();
      return;
    }

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@jinzmedia.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });

    console.log('Test admin user created successfully!');
    console.log('Email: admin@jinzmedia.com');
    console.log('Password: admin123');
    console.log('Role: admin');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTestAdmin(); 