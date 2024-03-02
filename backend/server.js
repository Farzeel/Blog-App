const express = require('express');
const dbConnect = require('./database/index');
const {PORT} = require("./config/index")
const router = require('./routes/index');
const errorHandler = require("./middlewares/errorHandler")
const CookieParser = require('cookie-parser');
const cors = require('cors');
const path =  require('path');
const job =  require('./corn.js');



const app = express();
job.start()

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true 
}));

// DATABSE CONNECTION
dbConnect();


// COKKIE MIDDLEWARE
app.use(CookieParser());



// JSON MIDDLEWARE
app.use(express.json({limit: '50mb'}));

// USE FOR ROUTING
app.use(router);

// STATIC FOLDER MIDDLEWARE
app.use("/storage", express.static("storage"));



// ERROR HANDLER MIDDLEWARE
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

