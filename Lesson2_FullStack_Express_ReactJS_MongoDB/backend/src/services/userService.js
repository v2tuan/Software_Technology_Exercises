// src/services/userService.js
require('dotenv').config();
const User = require('../models/userModel'); // chỉnh lại path nếu khác
const bcrypt = require('bcrypt');            // nếu bạn cài bcryptjs: require('bcryptjs')
const jwt = require('jsonwebtoken');

const saltRounds = 10;

const createUserService = async (name, email, password) => {
  try {
    // check user exist
    const user = await User.findOne({ email });
    if (user) {
      console.log(`user exist, chọn 1 email khác: ${email}`);
      return null;
    }

    // hash user password
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // save user to database
    const result = await User.create({
      name,
      email,
      password: hashPassword,
      role: 'User'
    });

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const loginService = async (email, password) => {
  try {
    // fetch user by email
    const user = await User.findOne({ email });
    if (!user) {
      return { EC: 1, EM: 'Email/Password không hợp lệ' };
    }

    // compare password
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return { EC: 1, EM: 'Email/Password không hợp lệ' };
    }

    // create an access token
    const payload = {
      email: user.email,
      name: user.name
    };

    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '1h'
    });

    return {
      EC: 0,
      access_token,
      user: {
        email: user.email,
        name: user.name
      }
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUserService = async () => {
  try {
    const result = await User.find({}).select('-password');
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  createUserService,
  loginService,
  getUserService
};