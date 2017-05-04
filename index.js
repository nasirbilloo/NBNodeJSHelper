'use strict';

module.exports.AuthenticationHelper = require("../routes/AuthenticationHelper");
module.exports.AuthorizationHelper = require("../routes/AuthorizationHelper");
module.exports.DBMongoLoader = require("../routes/DBMongoLoader");
module.exports.DBSQLLoader = require("../routes/DBSQLLoader");
module.exports.expressLogger = require("../routes/expressLogger");
module.exports.LoggerFactory = require("../routes/LoggerFactory");
module.exports.RouteFactory = require("../routes/RouteFactory");
module.exports.RouteHelper = require("../routes/RouteHelper");
module.exports.SimpleCrudHandler = require("../routes/SimpleCrudHandler");

module.exports.printMsg = function(){
    console.log("NB NodeJS Helper");
}
