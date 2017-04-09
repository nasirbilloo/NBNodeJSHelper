'use strict'
var mysql = require('mysql');
var MyVars = require('../MyVars');
var logger = require('../util/logger');

var MySQLConnection = function (poolSize, debug) {
    if (!poolSize || poolSize == NaN) poolSize = 100;
    if (poolSize < 0) poolSize = 100;
    this.pool = mysql.createPool({
        connectionLimit: poolSize,
        host: MyVars.DBHOST,
        user: MyVars.DBUSER,
        password: MyVars.DBPASS,
        database: MyVars.DBDB
    });
    debug ? this.debug = debug : this.debug = false;
}
MySQLConnection.prototype = {
    getConnection: function (cb) {
        var self = this;
        self.pool.getConnection(function (err, connection) {
            if (err) {
                return cb(err, null);
            } else {
                return cb(null, connection);
            }
        });
    },
}

var mySQLConnection = new MySQLConnection(100);
module.exports = mySQLConnection;
