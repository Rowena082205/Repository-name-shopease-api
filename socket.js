let io;

function registerIO(instance) {
  io = instance;
}

function emit(...args) {
  if (io) {
    io.emit(...args);
  }
}

module.exports = { registerIO, emit };
