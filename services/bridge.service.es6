const socketService = require('./socket.service.es6');
const userService = require('./user.service.es6');
const config = require('../config/env.config.es6');

const bridges = {};
const reverseBridges = {};
const waitingBridges = [];

function relayMessage(userId, message) {
    let bridge = bridges[userId] || reverseBridges [userId];
    if (bridge) {
        let user = userService.getUserById(bridge.to);
        let socket = socketService.getSocketById(user.socket);
        socket.emit('message', message);
    }
}

function createBridge(userIdA, userIdB) {
    let now = Date.now();
    bridges[userIdA] = {from: userIdA, to: userIdB, createdAt: now};
    reverseBridges[userIdB] = {from: userIdB, to: userIdA, createdAt: now};
}

function deleteBridge(userIdA, userIdB) {
    delete bridges[userIdA];
    delete reverseBridges[userIdA];
    delete bridges[userIdB];
    delete reverseBridges[userIdB];
    waitingBridges.push(userIdA);
    waitingBridges.push(userIdB);
}

function waitForBridge(userId) {
    let alreadyWaitingUser = waitingBridges.pop();
    if (alreadyWaitingUser) {
        createBridge(userId, alreadyWaitingUser);
    } else {
        waitingBridges.push(userId);
    }
}

function clearBridgeUser(userId) {
    let bridge = bridges[userId] || reverseBridges [userId];
    if (bridge) {
        deleteBridge(bridge.from, bridge.to);
    }
    let index = waitingBridges.indexOf(userId);
    if(index >= 0) {
        waitingBridges.splice(index, 1);
    }
    connectAwaitingUsers();
}

function connectAwaitingUsers() {
    if(waitingBridges.length > 1) {
        let userIdA = waitingBridges.pop();
        let userIdB = waitingBridges.pop();
        createBridge(userIdA, userIdB);
        connectAwaitingUsers();
    }
}

function shuffleBridges() {
    let userOnBridges = Object.keys(bridges);
    let percent = config.shuffle.percentage;
    percent = percent <= 0 ? 0 : percent;
    percent = percent >= 100 ? 100 : percent;
    percent = percent / 100;
    let numberOfBridgesToShuffle = parseInt(userOnBridges.length * percent);
    userOnBridges.shuffle();
    let toShuffle = userOnBridges.slice(0, numberOfBridgesToShuffle);
    for(let userIdA of toShuffle) {
        let bridge = bridges[userIdA];
        deleteBridge(bridge.from, bridge.to);
    }
    waitingBridges.shuffle();
    connectAwaitingUsers();
}

function countBridges() {
    return Object.keys(bridges).length;
}

exports.relayMessage = relayMessage;
exports.waitForBridge = waitForBridge;
exports.clearBridgeUser = clearBridgeUser;
exports.connectAwaitingUsers = connectAwaitingUsers;
exports.shuffleBridges = shuffleBridges;
exports.countBridges = countBridges;

// Ronald Fisher and Frank Yates shuffle
Array.prototype.shuffle = function () {
    this.forEach(
        function (v, i, a) {
            let j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
    );
    return this;
};