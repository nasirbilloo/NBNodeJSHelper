'use strict';

var winston = require('winston');

var LoggerFactory = function (loggerConfig) {
    this.loggerConfig = loggerConfig;
    this.logger = null;
}
LoggerFactory.prototype = {
    setLoggerConfig: function (loggerConfig) {
        this.loggerConfig = loggerConfig;
        this.initLogger();
    },
    getLogger: function(){
        return this.logger;
    },
    initLogger: function () {
        var self = this;
        this.logger = new winston.Logger({
            level: self.loggerConfig && self.loggerConfig.level ? self.loggerConfig.level : 'info',
            transports: [
                new (winston.transports.Console)({
                    timestamp: function () {
                        return Date.now();
                    },
                    formatter: function (options) {
                        // Return string will be passed to logger.
                        var dt = new Date(options.timestamp());
                        var dtString = dt.getMonth() + 1 + "/" + dt.getDate() + "/" + dt.getFullYear() + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
                        return dtString + ' - ' + options.level.toUpperCase() + ' - ' + (undefined !== options.message ? options.message : '');
                    }
                }),
                new (winston.transports.File)({
                    filename: self.loggerConfig && self.loggerConfig.filename ? self.loggerConfig.filename : "logger.log",
                    timestamp: function () {
                        return Date.now();
                    },
                    formatter: function (options) {
                        // Return string will be passed to logger.
                        var dt = new Date(options.timestamp());
                        var dtString = dt.getMonth() + 1 + "/" + dt.getDate() + "/" + dt.getFullYear() + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
                        return dtString + '' + ' ' + options.level.toUpperCase() + ' ' + (undefined !== options.message ? options.message : '');
                    }
                })
            ]
        });
    }
};


var loggerFactory = new LoggerFactory();
//loggerFactory.initLogger();

module.exports = loggerFactory;