const express = require('express');
const dbConnect = require('./database/index');
const {PORT} = require("./config/index")
const router = require('./routes/index');
const errorHandler = require("./middlewares/errorHandler")
const CookieParser = require('cookie-parser');

const app = express();

// DATABSE CONNECTION
dbConnect();

// COKKIE MIDDLEWARE
app.use(CookieParser());

// JSON MIDDLEWARE
app.use(express.json());

// USE FOR ROUTING
app.use(router);

// STATIC FOLDER MIDDLEWARE
app.use("/storage", express.static("storage"));

// ERROR HANDLER MIDDLEWARE
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
