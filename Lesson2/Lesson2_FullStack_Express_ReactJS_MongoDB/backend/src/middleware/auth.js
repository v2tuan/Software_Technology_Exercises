// src/middleware/auth.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Những path public (không yêu cầu token)
  // Vì router được mount tại /v1/api nên dùng req.path là đủ: '/', '/register', '/login'
  const whiteLists = ['/', '/register', '/login'];
  if (whiteLists.includes(req.path)) {
    return next();
  }

  // Lấy token từ header: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      message: 'Bạn chưa truyền Access Token ở header và/hoặc token bị hết hạn'
    });
  }

  // verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      email: decoded.email,
      name: decoded.name,
      // createdBy: 'hodianit' // nếu bạn muốn log thêm như trong slide
    };
    // console.log('>>> check token:', decoded);
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token bị hết hạn hoặc không hợp lệ'
    });
  }
};

module.exports = auth;