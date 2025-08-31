// src/models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name:   { type: String, required: true, trim: true },
    email:  { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true }, // đừng đặt select:false vì bạn đang cần so sánh mật khẩu lúc login
    role:   { type: String, enum: ['User', 'Admin'], default: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);