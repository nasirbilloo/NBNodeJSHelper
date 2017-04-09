'use strict';
var async = require('async');
var mongoose = require('mongoose');

var logger = require('../util/logger');
var MyVars = require('../MyVars');

var SQLLoader = function () {
    this.jiraSQLConverter = new JiraSQLConverter();
};


SQLLoader.prototype = {
    loadItemsToSQL: function (MySQLModel, items, cb) {
        var self = this;
        var len = items.length;
        var count = 0;

        async.eachSeries(items,
            function (item, callback) {
                count++;
                logger.debug("Updating " + MySQLModel.strTable + ": " + count + " of " + len);
                self.loadItemToSQL(MySQLModel, item, function (err, result) {
                    if (err) {
                        logger.error(MySQLModel.strTable + " - Error in loadItemsToSQL: " + err);
                        return callback(err);
                    }
                    setTimeout(callback, MyVars.sqlQueryTimeout);
                });
            },
            function (err) {
                if (err) {
                    logger.error(MySQLModel.strTable + " - Error in loadItemsToSQL: " + err);
                    return cb(err);
                } else {
                    return cb(null, "done");
                }
            }
        );
    },


    loadItemToSQL: function (MySQLModel, item, cb) {
        var self = this;
        self.jiraSQLConverter.convertItem(MySQLModel, item, function (err, data) {
            if (!err) {
                MySQLModel.insertOrUpdate(data, function (err1) {
                    if (err1) {
                        logger.error(MySQLModel.strTable + " - Error in loadItemToSQL: " + err1);
                        return cb(err1);
                    } else {
                        return cb(null);
                    }
                });
            } else {
                logger.error(MySQLModel.strTable + " - Error in loadItemToSQL: " + err);
                return cb(err);
            }
        });
    },
    loadItemsToMongo: function (MongoModel, items, cb) {
        var self = this;
        var len = items.length;
        var count = 0;

        async.eachSeries(items,
            function (item, callback) {
                count++;
                logger.debug("Updating item " + count + " of " + len);
                self.loadItemToMongo(MongoModel, item, function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    setTimeout(callback, MyVars.mongoQueryTimeout);
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


    loadItemToMongo: function (MongoModel, item, cb) {
        var self = this;
        MongoModel.update({
            id: item.id
        }, item, {
                upsert: true
            }, function (err) {
                if (err) {
                    logger.error(err);
                    return cb(err);
                } else {
                    return cb(null, "finished");
                }
            });
    },

    mergeObjects: function (obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (var attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    },

    loadItemsToSQL1: function (obj, MySQLModel, items, cb) {
        var self = this;
        var count = 0;
        var len = items.length;

        async.eachSeries(items,
            function (item, callback) {
                count++;
                logger.debug("Updating " + MySQLModel.strTable + ": " + count + " of " + len);
                self.loadItemToSQL1(obj, MySQLModel, item, function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    setTimeout(callback, MyVars.sqlQueryTimeout);
                });
            },
            function (err) {
                if (err) {
                    logger.error(MySQLModel.strTable + " - Error in loadItemsToSQL: " + err);
                    return cb(err);
                } else {
                    return cb(null, "done");
                }
            }
        );
    },
    loadItemToSQL1: function (obj, MySQLModel, item, cb) {
        var self = this;
        item = self.mergeObjects(item, obj);
        self.jiraSQLConverter.convertItem(MySQLModel, item, function (err, data) {
            if (!err) {

                MySQLModel.insertOrUpdate(data, function (err1) {
                    if (err1) {
                        return cb(err1);
                    } else {
                        return cb(null, "done");
                    }
                });
            } else {
                logger.error(MySQLModel.strTable + " - Error in loadItemToSQL1: " + err);
                return cb(err);
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
                logger.debug("Updating item " + count + " of " + len);
                self.loadItemToMongo1(obj, MongoModel, item, function (err, result) {
                    if (err) {
                        return callback(err);
                    } else {
                        setTimeout(callback, MyVars.mongoQueryTimeout);
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
    loadItemToMongo1: function (obj, MongoModel, item, cb) {
        var self = this;
        item = self.mergeObjects(item, obj);
        //console.dir(item);
        MongoModel.update({
            id: item.id
        }, item, {
                upsert: true
            }, function (err, numRows) {
                if (err) {
                    logger.error(err);
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
                        setTimeout(callback, MyVars.mongoQueryTimeout);
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