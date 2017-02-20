const commandLineArgs = require('command-line-args');
const optionDefinitions = [
    {name: 'port', alias: 'p', type: Number, defaultValue: process.env.QDP_CHAT_PORT || 7890},
    {name: 'db_name', type: String, defaultValue: process.env.QDP_CHAT_DB_NAME || 'qdp'  },
    {name: 'db_user', type: String, defaultValue: process.env.QDP_CHAT_DB_USER || 'root' },
    {name: 'db_password', type: String, defaultValue: process.env.QDP_CHAT_DB_PASSWORD || '' },
    {name: 'db_host', type: String, defaultValue: process.env.QDP_CHAT_DB_HOST || 'localhost' },
    {name: 'shuffle_active', type: Boolean, defaultValue: process.env.QDP_CHAT_SHUFFLE_ACTIVE || true },
    {name: 'shuffle_interval', type: Number, defaultValue: process.env.QDP_CHAT_SHUFFLE_INTERVAL || 10000 },
    {name: 'shuffle_percentage', type: Number, defaultValue: process.env.QDP_CHAT_SHUFFLE_PERCENTAGE || 100 },
    {name: 'identification_timeout', type: Number, defaultValue: process.env.QDP_CHAT_IDENTIFICATION_TIMEOUT || 5000 },
    {name: 'admin_pass', type: Number, defaultValue: process.env.QDP_CHAT_ADMIN_PASS || 'penpineappleapplepen' }
];
const options = commandLineArgs(optionDefinitions);

module.exports = {
    port: options.port,
    identificationTimeout: options.identification_timeout,
    shuffle: {
        active: options.shuffle_active,
        interval: options.shuffle_interval,
        percentage: options.shuffle_percentage
    },
    databaseConnection: {
        database: options.db_name,
        user: options.db_user,
        password: options.db_password,
        host: options.db_host
    },
    adminPass: options.admin_pass
};