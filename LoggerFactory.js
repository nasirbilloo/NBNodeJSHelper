'use strict';

var winston = require('winston');

var LoggerFactory = function (loggerConfig) {
    this.loggerConfig = loggerConfig;
    this.logger = null;
}
LoggerFactory.prototype = {
    setLoggerConfig: function (loggerConfig) {
        this.loggerConfig = loggerConfig;
    },
    getLogger: function(){
        return self.logger;
    },
    initLogger: function () {
        var self = this;
        self.logger = new winston.Logger({
            level: self.loggerConfig.level,
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
                    filename: self.loggerConfig.filename,
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


loggerFactory = new LoggerFactory();
loggerFactory.initLogger();

module.exports = loggerFactory;