var winston = require('winston');

var logger = new winston.Logger({
    level: 'info',
    transports: [
  new(winston.transports.Console)({
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
  new(winston.transports.File)({
            filename: '../JiraNasir.log',
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

//
// Replaces the previous transports with those in the
// new configuration wholesale.
//
/*
logger.configure({
    level: 'verbose',
    transports: [
  new require('winston-daily-rotate-file')(opts)
]
});
*/
module.exports = logger;