// src/config/viewEngine.js (CommonJS)
const path = require('path');
const express = require('express');

module.exports = function configViewEngine(app) {
  app.use(express.static(path.join(__dirname, '..', 'public'))); // /src/public
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '..', 'views'));         // /src/views
};