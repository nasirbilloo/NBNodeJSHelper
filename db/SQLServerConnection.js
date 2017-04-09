'use strict';
var sql = require('mssql');
var MyVars = require('../MyVars');
var logger = require('../util/logger');

var SQLConnection = function () {
    this.user = MyVars.DBUSER;
    this.password = MyVars.DBPASS;
    this.host = MyVars.DBHOST;
    this.instance = MyVars.DBINSTANCE;
    //this.port = strPort;
    this.db = MyVars.DBDB;
    this.connection = null;
    this.connected = false;
    this.dbConfig = {
        server: this.host,
        user: this.user,
        password: this.password,
        database: this.db,
        option: {
            instanceName: this.instance
        }
    };
};

SQLConnection.prototype = {
        connect: function (cb, count) {
            if (!count) count = 0;
            //console.log("Count: " + count);
            var self = this;
            if (!self.connection) {
                self.connected = false;
                var config = this.dbConfig;
                self.connection = new sql.Connection(config, function (err) {
                    if (err) {
                        var n = String(err).indexOf("Error Establishing Connection");
                        var m = String(err).indexOf("Failed to connect");
                        var o =  String(err).indexOf("Connection Lost");
                        logger.info("indexof m: " + m);
                        logger.info("indexof n: " + n);                        
                        logger.info("indexof n: " + o);                        
                        if ((n > -1 || m > -1 || o > -1) && count < 5){
                            logger.info(err);
                            logger.info("retrying connection: in " + MyVars.connectionRetry + " seconds");
                            count++;
                            setTimeout(function(){
                                self.connection = new sql.Connection(config, function(err){
                                    if (err){
                                        return cb(err);
                                    }else{
                                        return cb(null, self);
                                    }
                                });
                            }, MyVars.connectionRetry * 1000);
                        }else{
                            logger.error("SQLServerConnection.connect: " + err);
                            return cb(err);
                        }
                        
                        //return cb(err);
                    } else {
                        self.connected = true;
                        return cb(null, self);
                    }
                });
            } else {
                return cb(null, self);
            }
        },
        getConnection: function (cb) {
            return this.connect(cb);
            //return cb(null, this);
        },
        disconnect: function (cb) {
            var self = this;
            if (self.connection) {
                self.connection.close(function () {
                    self.connection = null;
                });
            }
            if (cb) cb(null, "disconnected");
        },
        release: function (cb) {
            this.disconnect(cb);
        },
        execute: function (procname, cb) {
            if (!this.connection) {
                return cb("Invalid Connection");
            } else {
                var request = new sql.Request(this.connection);
                //request.input('retident', 1);
                request.output('output_parameter', sql.Int);
                request.execute(procname, function (err, recordsets, returnValue) {
                    cb(null, returnValue);
                });
            }
        },
        query: function (strSQL, cb) {
            var self = this;
            if (!this.connection) {
                return cb("Invalid Connection");
            } else {
                try{
                var request = new sql.Request(this.connection);
                request.query(strSQL, function(err, result){
                    if (err){
                        return cb(err);
                    }else{
                        return cb(null, result);
                    }          
                });
                }catch(err){
                    var n = string(err).indexOf("Error Establishing Connection");
                    var m = string(err).indexOf("Connection Lost");                    
                    console.log("indexof: " + n);
                    console.log("indexof: " + m);                    
                    if (n > -1 || m > -1){
                        setTimeout(self.query(strSQL, cb), 1500);
                    }else{
                        logger.error("SQLServerConnection.query: " + err);
                        return cb(err);
                    }
                }
            };
        }
    }
    //var sqlConnection = new SQLConnection();
    //sqlConnection.connect(function(err){
    //    logger.error(err);
    //});
//module.exports = sqlConnection;
module.exports = SQLConnection;
