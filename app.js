const path = require('path');
const fs = require('fs');
const express = require('express');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const mongoose = require('mongoose');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//JSON bodyPardser
app.use(express.json());

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single('image')
);
//constructs an absolute path to serve images statically
app.use('/images', express.static(path.join(__dirname, 'images')));

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

//Sets better security for our response headers
app.use(helmet());
app.use(compression()); //image files are not compressed // some hosting providers can have compression built-in
//used for logging data
app.use(morgan('combined', { stream: accessLogStream })); // can also be done by hosting provider

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type',
    'Authorization'
  );
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

//executed whenever an error is thrown or forwarded with next
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;
  res.status(status).json({ message: message });
});

mongoose
  .connect(
    // 'mongodb+srv://Antho:LucAmMfcBVQyHam5@test.imnmi.mongodb.net/test?retryWrites=true&w=majority'
    //we can add env variables in the packageJSON file in the start
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@test.imnmi.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`
  )
  .then((result) => {
    const server = app.listen(process.env.PORT || 8080);
    // establishing a socket io connection
    const io = require('./socket').init(server); // returns a socket object
    io.on('connection', (socket) => {
      // will fire when a client connects here
      console.log('Client Connected');
      // we should open the socket on the client side
    });
  })
  .catch((err) => console.log(err));
