const io = require('../servers').io;
const Orb = require('./classes/Orb');
const Player = require('./classes/Player');
const PlayerConfig = require('./classes/PlayerConfig');
const PlayerData = require('./classes/PlayerData');
const { platform } = require('os');

let orbs = [];
let players = [];
let settings = {
  defaultOrbs: 500,
  defaultSpeed: 6,
  defaultSize: 6,
  // as player gets bigger the zoom should go out
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500,
};

initGame();

// Issue a message to EVERY connected socket 30fps
setInterval(() => {
  io.to('game').emit('tock', {
    players,
  });
}, 33); // there are 30 33s in 1000 miliseconds 1 of 30fps

io.sockets.on('connect', (socket) => {
  let player = {};
  // a player connected
  socket.on('init', (data) => {
    // add the player to game namespace
    socket.join('game');
    // make a config object
    let playerConfig = new PlayerConfig(settings);
    let playerData = new PlayerData(data.playerName, settings);
    // the player obj that holds all player's data
    player = new Player(socket.id, playerConfig, playerData);
    socket.emit('initReturn', {
      orbs,
    });
    players.push(player);
  });
  // the server sent over a tick, we know what direction to move the socket
  socket.on('tick', (data) => {
    speed = player.playerConfig.speed;
    // update the config object, with the new direction in data
    xV = player.playerConfig.xVector = data.xVector;
    yV = player.playerConfig.yVector = data.yVector;

    if (
      (player.playerData.locX < 5 && player.playerData.xVector < 0) ||
      (player.playerData.locX > 500 && xV > 0)
    ) {
      player.playerData.locY -= speed * yV;
    } else if (
      (player.playerData.locY < 5 && yV > 0) ||
      (player.playerData.locY > 500 && yV < 0)
    ) {
      player.playerData.locX += speed * xV;
    } else {
      player.playerData.locX += speed * xV;
      player.playerData.locY -= speed * yV;
    }
  });
});

// Run at the begining of a new game
function initGame() {
  for (let index = 0; index < settings.defaultOrbs; index++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;
