const sockets = {};

function addSocket(socket) {
    sockets[socket.id] = socket;
}

function removeSocket(socket) {
    if(socket.connected) {
        socket.disconnect();
    }
    delete sockets[socket.id];
}

function getSocketById(id) {
    return sockets[id];
}

function countSockets() {
    return Object.keys(sockets).length;
}

exports.addSocket = addSocket;
exports.removeSocket = removeSocket;
exports.getSocketById = getSocketById;
exports.countSockets = countSockets;