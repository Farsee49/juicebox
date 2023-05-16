console.log('Felix Good Boy');

const PORT = 3000;
const express = require('express');
const server = express();

server.listen(PORT, () => {
  console.log('PORTAL ACTIVATED AT:', PORT)
});