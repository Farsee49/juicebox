console.log('Felix Good Boy');

const PORT = 3000;
const express = require('express');
const server = express();
const morgan = require('morgan');
server.use(morgan('dev'));
const { client } = require('./db');
client.connect();
server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});
server.use(express.json())
const apiRouter = require('./api');
server.use('/api', apiRouter);


server.listen(PORT, () => {
  console.log('PORTAL ACTIVATED AT:', PORT)
});