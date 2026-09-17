require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const { registerIO } = require('./socket');

let app;
const httpServer = http.createServer((req, res) => app(req, res));
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' }
});
registerIO(io);
module.exports.io = io;
app = require('./app');

const mongoConnection = mongoose.connect(process.env.MONGO_URI);
mongoConnection.catch(err => console.error(err));

if (require.main === module) {
  mongoConnection
    .then(() => {
      httpServer.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
    })
    .catch(err => console.error(err));
}