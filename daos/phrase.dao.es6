const dao = require('../database/connection.es6');

function insert(phrase) {
    let query = 'INSERT INTO `phrases` (`phrase`) VALUES (?)';
    return dao.executeQuery(query, [phrase]);
}

function get(limit = 1) {
    let query = 'SELECT phrase FROM `phrases` ORDER BY RAND() LIMIT ? ';
    return dao.executeQuery(query, [limit]);
}

function del(id) {
    let query = 'DELETE FROM `phrases` WHERE `id` = ?';
    return dao.executeQuery(query, [id]);
}

exports.insert = insert;
exports.get = get;
exports.del = del;