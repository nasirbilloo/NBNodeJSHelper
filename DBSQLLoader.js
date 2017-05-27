'use strict';
var async = require('async');

var SQLLoader = function () {
    //this.jiraSQLConverter = new JiraSQLConverter();
    this.logger = require('./LoggerFactory').getLogger();
    this.routeHelper = require('./RouteHelper');
    this.MyVars = require('@nasirb/nbnodejsdb/DBConnectionFactory').getConnectionParameters();
    this.SQLConverter = require('@nasirb/nbnodejsdb/DBConnectionFactory').getSQLConverter();
    this.debug = false;
};


SQLLoader.prototype = {
    loadItemsToSQL: function (MySQLModel, items, cb) {
        if (this.debug) console.log("In SQLLoader: loadItemsToSQL");
        var self = this;
        var len = items.length;
        var count = 0;

        async.eachSeries(items,
            function (item, callback) {
                count++;
                self.logger.debug("Updating " + MySQLModel.tableName + ": " + count + " of " + len);
                self.loadItemToSQL(MySQLModel, item, function (err, result) {
                    if (err) {
                        self.logger.error(MySQLModel.tableName + " - Error in loadItemsToSQL: " + err);
                        return callback(err);
                    }
                    setTimeout(callback, self.MyVars.sqlQueryTimeout);
                });
            },
            function (err) {
                if (err) {
                    self.logger.error(MySQLModel.tableName + " - Error in loadItemsToSQL: " + err);
                    return cb(err);
                } else {
                    return cb(null, "done");
                }
            }
        );
    },


    loadItemToSQL: function (MySQLModel, item, cb) {
        if (this.debug) console.log("In SQLLoader: loadItemToSQL");        
        var self = this;
        if (!MySQLModel){
            return cb("DBSQLLoader Error: Invalid Model");
        }
        if (self.SQLConverter) {
            self.SQLConverter.convertItem(MySQLModel, item, function (err, data) {
                MySQLModel.insertOrUpdate(data, function (err1) {
                    if (err1) {
                        self.logger.error(MySQLModel.tableName + " - Error in loadItemToSQL: " + err1);
                        return cb(err1);
                    } else {
                        return cb(null);
                    }
                });
            });
        } else {
            MySQLModel.insertOrUpdate(item, function (err1) {
                if (err1) {
                    self.logger.error(MySQLModel.tableName + " - Error in loadItemToSQL: " + err1);
                    return cb(err1);
                } else {
                    return cb(null);
                }
            });
        }
    },

    loadItemsToSQL1: function (obj, MySQLModel, items, cb) {
        if (this.debug) console.log("In SQLLoader: loadItemsToSQL1");
        var self = this;
        var count = 0;
        var len = items.length;

        async.eachSeries(items,
            function (item, callback) {
                count++;
                self.logger.debug("Updating " + MySQLModel.tableName + ": " + count + " of " + len);
                self.loadItemToSQL1(obj, MySQLModel, item, function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    setTimeout(callback, self.MyVars.sqlQueryTimeout);
                });
            },
            function (err) {
                if (err) {
                    self.logger.error(MySQLModel.tableName + " - Error in loadItemsToSQL: " + err);
                    return cb(err);
                } else {
                    return cb(null, "done");
                }
            }
        );
    },
    loadItemToSQL1: function (obj, MySQLModel, item, cb) {
        if (this.debug) console.log("In SQLLoader: loadItemToSQL1");        
        var self = this;
        item = self.routeHelper.mergeObjects(item, obj);
        if (self.SQLConverter) {
            self.SQLConverter.convertItem(MySQLModel, item, function (err, data) {
                MySQLModel.insertOrUpdate(data, function (err1) {
                    if (err1) {
                        return cb(err1);
                    } else {
                        return cb(null, "done");
                    }
                });
            });
        } else {
            MySQLModel.insertOrUpdate(item, function (err1) {
                if (err1) {
                    return cb(err1);
                } else {
                    return cb(null, "done");
                }
            });
        }
    },
}

module.exports = SQLLoader;