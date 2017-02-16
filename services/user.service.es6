const users = {};

const socketService = require('./socket.service.es6');

function addUser(userId, socketId) {
    removeUser(userId);
    users[userId] = {
        id: userId,
        socket: socketId,
        createdAt: Date.now()
    };
}

function removeUser(userId) {
    delete users[userId];
}

function getUserById(userId) {
    return users[userId];
}

function countUsers() {
    return Object.keys(users).length;
}

exports.addUser = addUser;
exports.removeUser = removeUser;
exports.getUserById = getUserById;
exports.countUsers = countUsers;