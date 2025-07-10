const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config();

const app = require('./app');
const connectDB = require('./src/config/database');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const packagesDir = path.join(uploadsDir, 'packages');
const servicesDir = path.join(uploadsDir, 'services');
const servicesImagesDir = path.join(servicesDir, 'images');
const servicesVideosDir = path.join(servicesDir, 'videos');

[uploadsDir, packagesDir, servicesDir, servicesImagesDir, servicesVideosDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Base URL: ${process.env.BASE_URL}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to uncaught exception');
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  console.log('Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
}); 