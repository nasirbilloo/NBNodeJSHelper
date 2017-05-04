'use strict';
var async = require('async');
var mongoose = require('mongoose');

var SQLLoader = function () {
    this.logger = require('LoggerFactory').getLogger();
    this.routeHelper = require('RouteFactory').routeHelper;
    this.MyVars = require('@nasirb/nbnodejsdb/DBConnectionFactory').getConnectionParameters();
};


SQLLoader.prototype = {
    loadItemsToMongo: function (MongoModel, items, cb) {
        var self = this;
        var len = items.length;
        var count = 0;

        async.eachSeries(items,
            function (item, callback) {
                count++;
                self.logger.debug("Updating item " + count + " of " + len);
                self.loadItemToMongo(MongoModel, item, function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    setTimeout(callback, MyVars.mongoQueryTimeout);
                });
            },
            function (err) {
                if (err) {
                    self.logger.error(err);
                    return cb(err);
                } else {
                    return cb(null, "done");
                }
            }
        );
    },


    loadItemToMongo: function (MongoModel, item, cb) {
        var self = this;
        MongoModel.update({
            id: item.id
        }, item, {
                upsert: true
            }, function (err) {
                if (err) {
                    self.logger.error(err);
                    return cb(err);
                } else {
                    return cb(null, "finished");
                }
            });
    },



    loadItemsToMongo1: function (obj, MongoModel, items, cb) {
        var self = this;
        var count = 0;
        var len = items.length;

        async.eachSeries(items,
            function (item, callback) {
                count++;
                self.logger.debug("Updating item " + count + " of " + len);
                self.loadItemToMongo1(obj, MongoModel, item, function (err, result) {
                    if (err) {
                        return callback(err);
                    } else {
                        setTimeout(callback, self.MyVars.mongoQueryTimeout);
                    }
                });
            },
            function (err) {
                if (err) {
                    self.logger.error(err);
                    return cb(err);
                } else {
                    return cb(null, "done");
                }
            }
        );
    },
    loadItemToMongo1: function (obj, MongoModel, item, cb) {
        var self = this;
        item = self.routeHelper.mergeObjects(item, obj);
        //console.dir(item);
        MongoModel.update({
            id: item.id
        }, item, {
                upsert: true
            }, function (err, numRows) {
                if (err) {
                    self.logger.error(err);
                    return cb(err);
                } else {
                    return cb(null, "finished");
                }
            });
    },    
    loadItemsToMongo2: function (obj, MongoModel, items, cb) {
        var self = this;
        var count = 0;
        var len = items.length;

        async.eachSeries(items,
            function (item, callback) {
                count++;
                logger.debug("Updating item " + count + " of " + len);
                self.loadItemToMongo2(obj, MongoModel, item, function (err, result) {
                    if (err) {
                        return callback(err);
                    } else {
                        setTimeout(callback, self.MyVars.mongoQueryTimeout);
                    }
                });
            },
            function (err) {
                if (err) {
                    logger.error(err);
                    return cb(err);
                } else {
                    return cb(null, "done");
                }
            }
        );
    },    
}

module.exports = SQLLoader;