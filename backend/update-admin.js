require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function updateAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update existing admin to ensure role is correct
    const result = await User.findOneAndUpdate(
      { email: 'admin@jinzmedia.com' },
      { 
        role: 'admin',
        isActive: true,
        name: 'Admin JINZ Media'
      },
      { new: true }
    );

    if (result) {
      console.log('Admin user updated successfully!');
      console.log('Updated user:', {
        _id: result._id,
        name: result.name,
        email: result.email,
        role: result.role,
        isActive: result.isActive
      });
    } else {
      console.log('Admin user not found');
    }
  } catch (error) {
    console.error('Error updating admin user:', error);
  } finally {
    await mongoose.connection.close();
  }
}

updateAdmin(); 