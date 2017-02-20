const mysql = require('promise-mysql');
const config = require('../config/env.config.es6');
const sqlQyery = require('bluebird');

let pool = mysql.createPool(config.databaseConnection);

function getConnection() {
    return pool.getConnection().disposer(function (connection) {
        pool.releaseConnection(connection);
    });
}

function executeQuery(query, queryParams = []) {
    return sqlQyery.using(getConnection(), (connection) => {
        return connection.query(query, queryParams);
    });
}

exports.executeQuery = executeQuery;
