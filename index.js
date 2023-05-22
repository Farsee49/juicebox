require('dotenv').config();

const PORT = process.env.PORT;
const express = require('express');
const server = express();
const morgan = require('morgan');
const { client } = require('./db');
client.connect();
server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});
const apiRouter = require('./api');
server.use('/api', apiRouter);

server.use(morgan('dev'));
server.use(express.json());


server.listen(PORT, () => {
  console.log('PORTAL ACTIVATED AT:', PORT)
});