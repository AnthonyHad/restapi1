const path = require('path');
const express = require('express');
const feedRoutes = require('./routes/feed');

const mongoose = require('mongoose');

const app = express();

app.use(express.json());

//constructs an absolute path to serve images statically
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);

//executed whenever an error is thrown or forwarded with next
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(
    'mongodb+srv://Antho:LucAmMfcBVQyHam5@test.imnmi.mongodb.net/test?retryWrites=true&w=majority'
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
