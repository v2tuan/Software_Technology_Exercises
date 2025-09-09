// src/routes/api.js
const express = require('express');
const {
  createUser,
  handleLogin,
  getUser,
  getAccount
} = require('../controllers/userController.js');
const auth = require('../middleware/auth.js');
const delay = require('../middleware/delay.js');
const { productController } = require('../controllers/productController.js');
const { categoryController } = require('../controllers/categoryController.js');

const routerAPI = express.Router();

// ===== Public routes =====
routerAPI.get('/', (req, res) => {
  return res.status(200).json('Hello world api');
});
routerAPI.post('/register', createUser);
routerAPI.post('/login', handleLogin);
routerAPI.post('/seed', productController.seedData)
routerAPI.get('/products', productController.getProducts)
routerAPI.get('/categories', categoryController.getCategories)

// ===== Protected routes =====
routerAPI.use(auth);                // từ đây trở xuống yêu cầu auth
routerAPI.get('/user', getUser);
routerAPI.get('/account', delay, getAccount);

module.exports = routerAPI;         // đừng gõ nhầm 'module.exprots'