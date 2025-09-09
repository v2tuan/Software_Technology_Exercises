// server.js
require('dotenv').config();                 // load biến môi trường

// import các nguồn cần dùng (CommonJS)
const express = require('express');
const cors = require('cors');

const configViewEngine = require('./config/viewEngine.js');
const apiRoutes = require('./routes/api');
const connection = require('./config/database');        // hàm connect DB
const { getHomepage } = require('./controllers/homeController');

const app = express();                                  // cấu hình app là express

// cấu hình port, nếu tìm thấy port trong env, không thì trả về 8888
const port = process.env.PORT || 8888;

app.use(cors());                                        // config CORS
app.use(express.json());                                // config req.body cho JSON
app.use(express.urlencoded({ extended: true }));        // for form-data / x-www-form-urlencoded

configViewEngine(app);                                  // config template engine (EJS, static, v.v.)

// config route cho view ejs
const webAPI = express.Router();
webAPI.get('/', getHomepage);
app.use('/', webAPI);

// khai báo route cho API
app.use('/v1/api', apiRoutes);

// khởi động: kết nối DB rồi mới lắng nghe cổng
(async () => {
  try {
    // kết nối database using mongoose
    await connection();

    // lắng nghe port trong env
    app.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`);
    });
  } catch (error) {
    console.log('>>> Error connect to DB: ', error);
    process.exit(1);
  }
})();