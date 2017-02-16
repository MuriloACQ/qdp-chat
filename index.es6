const app = require('http').createServer();
const io = require('socket.io')(app);
const socketService = require('./services/socket.service.es6');
const messageService = require('./services/message.service.es6');
const bridgeService = require('./services/bridge.service.es6');
const config = require('./config/env.config.es6');

app.listen(config.port);

io.on('connection', function (socket) {
    socketService.addSocket(socket);
    messageService.messageHandshakeHandler(socket);
});

if(config.shuffle.active) {
    setInterval(bridgeService.shuffleBridges, config.shuffle.interval);
}