'use strict';
var sql = require('mssql');
var logger = require('../util/logger');

var SQLQuery = function (connection) {
    this.connection = connection;
    this.debug = false;
};

SQLQuery.prototype = {
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
        logger.debug("SQLQuery: " + sqlstring);
        if (!self.connection) {
            return cb("invalid connection Error");
        }else{
            self.connection.query(sqlstring, function (err, recordset) {
                if (err) {
                    logger.error("SQLServerQuery.query: " + err);
                    return cb(err + "\n SQL Statement: " + sqlstring);
                }
                return cb(null, recordset);
              //return cb("stuff");
            });
        }
    },
};

module.exports = SQLQuery;
