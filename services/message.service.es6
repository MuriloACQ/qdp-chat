const config = require('../config/env.config.es6');
const socketService = require('./socket.service.es6');
const userService = require('./user.service.es6');
const bridgeService = require('./bridge.service.es6');
const commandService = require('./command.service.es6');

function messageHandshakeHandler(socket) {
    let userId = null;
    let timeoutId = setTimeout(() => {
        socketService.removeSocket(socket);
    }, config.identificationTimeout);
    socket.on('message', (message) => {
        if (timeoutId) {
            clearInterval(timeoutId);
            socketService.removeSocket(socket);
        } else {
            messageHandler(userId, message);
        }
    });
    socket.on('identification', (identification) => {
        clearTimeout(timeoutId);
        timeoutId = null;
        userId = identification;
        userService.addUser(userId, socket.id);
        bridgeService.waitForBridge(userId);
    });
    socket.on('disconnect', () => {
        if (userId) {
            bridgeService.clearBridgeUser(userId);
            userService.removeUser(userId);
        }
        socketService.removeSocket(socket);
    });
}

function messageHandler(userId, message) {
    let command = commandService.parse(message, userId);
    if (command) {
        commandService.executeCommand(command)
    } else {
        bridgeService.relayMessage(userId, message);
    }
}

exports.messageHandshakeHandler = messageHandshakeHandler;
exports.messageHandler = messageHandler;