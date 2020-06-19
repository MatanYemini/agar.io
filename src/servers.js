// Server.js is only for the making of the socketio server and the express server
const express = require('express');
const socketio = require('socket.io');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(8080);
const io = socketio(expressServer);

// App organization
module.exports = {
  app,
  io,
};
