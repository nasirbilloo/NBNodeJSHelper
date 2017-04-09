'use strict';
var sql = require('mysql');
var logger = require('../util/logger');

var MySQLQuery = function(connection){
//    logger.log("In Projects constructor");
    this.connection = connection;
    this.debug = false;    
};

MySQLQuery.prototype = {
    setDebug: function (debug) {
        this.debug = debug;
    },
    query: function (strSQL, cb) {
        var self = this;
        if (!this.connection) {
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Connection Error");
            }
        }
        self.runQuery(strSQL, cb);
    },
    runQuery: function (sqlstring, cb) {
        var self = this;
        logger.debug("MySQLQuery: " + sqlstring);
        if (!self.connection) {
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid connection Error");
            }
        }
        //logger.log(sqlstring);
        this.connection.query(sqlstring, function(err, rows, fields){
            if (err) {
                logger.error("MySQLQuery.query: " + err);
                return cb(err + "\n SQL Statement: " + sqlstring);
            }
            return cb(null, rows);
        });
    },    
};

module.exports = MySQLQuery;
