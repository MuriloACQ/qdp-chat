const userService = require('../services/user.service.es6');
const config = require('../config/env.config.es6');
const phraseDao = require('../daos/phrase.dao.es6');
const socketService = require('../services/socket.service.es6');

function parse(message, userId) {
    let command = null;
    let matches = message.match(/^\\([^\\].*?):([^:]*):?(.*)$/);
    if (matches) {
        command = {
            name: matches[1],
            action: matches[2],
            data: matches[3],
            user: userId
        }
    }
    return command;
}

function executeCommand(command) {
    switch (command.name) {
        case 'admin':
            return adminAction(command);
        case 'users':
            return usersAction(command);
        case 'phrases':
            return phrasesAction(command);
        case 'messages':
            return messageAction(command);
        default:
            return returnError();
    }
}

function messageAction(command) {
    switch (command.action) {
        case 'broadcast':
            return messageBroadcast(command);
        default:
            return returnError();
    }
}

function messageBroadcast(command) {
    let user = userService.getUserById(command.user);
    if (user.isAdmin && command.data) {
        let users = userService.getAll();
        for (let toUserId in users) {
            if(users.hasOwnProperty(toUserId)) {
                let toUser = users[toUserId];
                if (command.user === toUser.id) continue;
                let socket = socketService.getSocketById(toUser.socket);
                socket.emit('message', command.data);
            }
        }
        return returnOK();
    }
    return returnError();
}

function phrasesAction(command) {
    switch (command.action) {
        case 'insert':
            return phrasesInsert(command);
        default:
            return returnError();
    }
}

function phrasesInsert(command) {
    let user = userService.getUserById(command.user);
    if (user.isAdmin && command.data) {
        phraseDao.insert(command.data);
        return returnOK();
    }
    return returnError();
}

function usersAction(command) {
    switch (command.action) {
        case 'count':
            return usersCount(command);
        default:
            return returnError();
    }
}

function usersCount(command) {
    let user = userService.getUserById(command.user);
    if (user.isAdmin) {
        return userService.countUsers();
    }
    return returnError();
}

function adminAction(command) {
    switch (command.action) {
        case 'login':
            return adminLogin(command);
        case 'logout':
            return adminLogout(command);
        default:
            return returnError();
    }
}

function adminLogin(command) {
    if (command.data === config.adminPass) {
        let user = userService.getUserById(command.user);
        user.isAdmin = true;
        return returnOK();
    }
    return returnError();
}

function adminLogout(command) {
    let user = userService.getUserById(command.user);
    user.isAdmin = false;
    return returnOK();
}

function returnError() {
    return 'azedou';
}

function returnOK() {
    return 'queijado';
}

exports.parse = parse;
exports.executeCommand = executeCommand;