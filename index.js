module.exports.GenericSimpleModel = requier("../db/GenericSimpleModel");
module.exports.MySQLConnection = require("../db/MySQLConnection.js");
module.exports.MySQLQuery = require("../db/MySQLQuery.js");
module.exports.MySQLTable = require("../db/MySQLTable.js");
module.exports.MySQLTable2 = require("../db/MySQLTable2.js");
module.exports.SQLServerConnection = require("../db/SQLServerConnection.js");
module.exports.SQLServerQuery = require("../db/SQLServerQuery.js");
module.exports.SQLServerTable = require("../db/SQLServerTable.js");
module.exports.SQLServerTable2 = require("../db/SQLServerTable2.js");

module.exports.RouteHelper = require("../routes/RouteHelper");
module.exports.SimpleCrudHandler = require("../routes/SimpleCrudHandler");

module.exports.printMsg = function(){
    console.log("NB NodeJS Helper");
}
