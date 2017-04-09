'use strict';

var MySQLConnection = require('../../db/MySQLConnection');
//var MySQLTable2 = require('../../db/MySQLTable2');
var SQLConnection = require('../../db/SQLServerConnection');
var SQLQuery = require('../../db/SQLServerQuery');

var SQLServerTable2 = require('../../db/SQLServerTable2');
var MyVars = require('../../MyVars');

var logger = require('../../util/logger');


var GenericSimpleModel = function (table, primaryKey, dbType, debug) {
    this.strTable = table;
    this.debug = debug;
    this.dbType = dbType ? dbType : MyVars.DBTYPE;
    this.Table = null;
    this.retID = false;
    if (this.dbType == MyVars.DBTypes.MySQL) {
        this.Table = new MySQLTable2(this.strTable, primaryKey);
    } else {
        this.Table = new SQLServerTable2(this.strTable, primaryKey);
    }
    this.Table.debug = this.debug;
    this.dbConn = null;
    this.hasDBConn = false;
};

GenericSimpleModel.prototype = {
    setDebug: function (debug) {
        this.debug = true;
        this.Table.debug = this.debug;
        console.log("TABLE DEBUG: " + this.Table.debug + " " + this.Table.table);
    },
    setRetID: function (retID) {
        this.retID = retID;
    },
    setDBConn: function (dbConn) {
        this.dbConn = dbConn;
        this.hasDBConn = true;
    },
    getConnection: function (cb) {
        if (this.hasDBConn) {
            return cb(null, this.dbConn);
        } else {
            if (this.dbType == MyVars.DBTypes.MySQL) {
                return MySQLConnection.getConnection(cb);
            } else if (this.dbType == MyVars.DBTypes.SQLServer) {
                var sqlConn = new SQLConnection();
                //var sqlConn = SQLConnection;            
                return sqlConn.getConnection(cb);
            } else {
                return cb("Invalid db type");
            }
        }
    },
    releaseConnection: function (dbConn) {
        if (this.hasDBConn) { //Connection came from outside, don't release it!
            ;//return cb(null);
        } else {

            if (this.dbType == MyVars.DBTypes.MySQL) {
                if (dbConn) {
                    dbConn.release();
                }
            } else if (this.dbType == MyVars.DBTypes.SQLServer) {
                if (dbConn) {
                    dbConn.release();
                }
            } else {
               ; //return cb("Invalid db type");
            }
        }
    },
    getAll: function (cb) {
        var self = this;
        self.getConnection(function (err, dbConn) {
            if (err) {
                return cb(err, null);
            }
            self.Table.findAll(dbConn, function (err2, results) {
                if (err2) {
                    self.releaseConnection(dbConn)
                    return cb(err2, null);
                }
                self.releaseConnection(dbConn)
                return cb(null, results);
            });
        });
    },
    getSome: function (obj, cb) {
        var self = this;
        self.getConnection(function (err, dbConn) {
            if (err) {                
                return cb(err, null);
            }
            self.Table.findFew(dbConn, obj, function (err2, results) {
                if (err2) {
                    self.releaseConnection(dbConn)
                    return cb(err2, null);
                }
                self.releaseConnection(dbConn)
                return cb(null, results);
            });
        });
    },
    getWithID: function (itemID, itemIDName, cb) {
        var self = this;
        var options =
            self.getConnection(function (err, dbConn) {
                if (err) {
                    return cb(err, null);
                }
                var obj = {};
                obj[itemIDName] = "=" + itemID;
                self.Table.findFew(dbConn, obj, function (err2, results) {
                    if (err2) {
                        self.releaseConnection(dbConn)
                        return cb(err2, null);
                    }
                    self.releaseConnection(dbConn)
                    return cb(null, results);
                });
            });
    },
    simpleUpdate: function (data, cb) {
        var self = this;
        self.getConnection(function (err, dbConn) {

            if (err) { //Error getting Conn
                return cb(err, null);
            }

            self.Table.update(dbConn, data, function (err3, results) {
                self.releaseConnection(dbConn)
                if (err3) {
                    return cb(err3, null);
                } else {
                    return cb(null, results);
                }
            });

        }); //Connection
    },
    update: function (data, cb) {
        var self = this;
        if (self.debug) logger.debug("update");
        self.getConnection(function (err, dbConn) {

            if (err) { //Error getting Conn
                return cb(err, null);
            }
            self.Table.findOne(dbConn, data, function (err1, results) {
                if (err1 || !results || results.length < 1) {
                    return cb(err1);
                } else {
                    self.Table.updateWithCompare(dbConn, results[0], data, function (err3, results) {
                        self.releaseConnection(dbConn)
                        if (err3) {
                            return cb(err3, null);
                        } else {
                            return cb(null, results);
                        }
                    });
                }
            }); //FindOne
        }); //Connection
    },
    getIDCol: function (dbConn, cb) {
        var self = this;
        var strSQL = "SELECT max(id) as insertId from " + self.Table.table;
        var issueQuery = new SQLQuery(dbConn);
        console.log(strSQL);
        issueQuery.query(strSQL, function (err, results) {
            if (err) {
                console.log(err);
                return cb(err);
            } else {
                console.log(results);
                return cb(null, results);
            }
        });
    },
    insert: function (data, cb) {
        var self = this;
        self.getConnection(function (err, dbConn) {
            if (err) { //Error getting Conn
                return cb(err, null);
            }
            self.Table.insert(dbConn, data, function (err2, results) {
                if (self.retID) {
                    self.getIDCol(dbConn, function (err3, results2) {
                        self.releaseConnection(dbConn)
                        if (err3) {
                            return cb(err3);
                        } else {
                            return cb(null, results2);
                        }
                    })
                } else {
                    self.releaseConnection(dbConn)
                    if (err2) {
                        return cb(err2, null);
                    } else {
                        //logger.dir("done with insert");
                        return cb(null, results);
                    }
                }
            });
        });
    },
    insertOrUpdate: function (data, cb) {
        //logger.dir(data);
        var self = this;
        if (self.debug) logger.debug("insertOrUpdate");
        self.getConnection(function (err, dbConn) {
            if (err) { //Error getting Conn
                return cb(err, null);
            }
            self.Table.exists(dbConn, data, function (err1, results) {
                //logger.debug("insertOrUpdate");
                if (err1) { //Error in query
                    self.releaseConnection(dbConn);
                    return cb(err1, null);
                } else {
                    self.releaseConnection(dbConn)
                    if (!results || results.length < 1) { //Doesn't Existt
                        return self.insert(data, cb);

                    } else { //Exists
                        return self.update(data, cb);
                    }
                }
            });
        });
    },
    exists: function (data, cb) {
        var self = this;
        if (self.debug) logger.debug("insertOrUpdate");
        self.getConnection(function (err, dbConn) {
            if (err) { //Error getting Conn
                return cb(err, null);
            }
            self.Table.exists(dbConn, data, function (err1, results) {
                //logger.debug("insertOrUpdate");
                if (err1) { //Error in query
                    self.releaseConnection(dbConn);
                    return cb(err1, null);
                } else {
                    self.releaseConnection(dbConn)
                    if (!results || results.length < 1) { //Doesn't Existt
                        return cb(null, false);

                    } else { //Exists
                        return cb(null, true);
                    }
                }
            });
        });
    },
    removeSimple: function (data, cb) {
        var self = this;
        self.getConnection(function (err, dbConn) {
            if (err) { //Error getting Conn
                self.releaseConnection(dbConn);
                return cb(err, null);
            }
            self.Table.remove(dbConn, data, function (err3, results) {
                self.releaseConnection(dbConn);
                if (err3) {
                    return cb(err3, null);
                } else {
                    return cb(null, results);
                }
            });
        });
    },
    removeIfExists: function (data, cb) {
        var self = this;
        self.getConnection(function (err, dbConn) {
            if (err) { //Error getting Conn
                self.releaseConnection(dbConn);
                return cb(err, null);
            }
            self.Table.exists(dbConn, data, function (err1, results) {
                if (err1) { //Error in query
                    self.releaseConnection(dbConn);
                    return cb(err1, null);
                } else {
                    if (!results || results.length < 1) { //Doesn't Exist
                        self.releaseConnection(dbConn);
                        return cb(null, "Can't delete, doesn't exist");
                    } else { //Exists
                        self.Table.remove(dbConn, data, function (err3, results) {
                            self.releaseConnection(dbConn);
                            if (err3) {
                                return cb(err3, null);
                            } else {
                                return cb(null, results);
                            }
                        });
                    }
                }
            });
        });
    }
}

module.exports = GenericSimpleModel