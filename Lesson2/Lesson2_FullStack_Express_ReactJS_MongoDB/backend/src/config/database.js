const { default: mongoose } = require('mongoose');
const { createProductIndex, importProductToES } = require('../utils/syncProduct');
// src/config/database.js
require('dotenv').config();

const dbState = [
  { value: 0, label: 'Disconnected' },
  { value: 1, label: 'Connected' },
  { value: 2, label: 'Connecting' },
  { value: 3, label: 'Disconnecting' }
];

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL || process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME
    });

    const state = Number(mongoose.connection.readyState);
    const label = (dbState.find(f => f.value === state) || {}).label || 'Unknown';
    console.log(label, 'to database');

    await createProductIndex()
    await importProductToES()
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
};

module.exports = connection;