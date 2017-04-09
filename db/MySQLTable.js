    'use strict';
var sql = require('mysql');
var logger = require('../util/logger');

var MySQLTable = function(connection, strTable){
    this.table = strTable;
    this.connection = connection;
    this.userID = "SYS";
};

MySQLTable.prototype = {
    findAll: function(cb){
        var self = this;
        if (!this.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Connection Error");
            }
        }
        var strSQL = "select * from " + self.table;
        self.runQuery(strSQL, cb);
    },
    find: function(object, cb){
      return this.findFew(object, cb);  
    },
    findFew: function(object,cb){
        var self = this;
        if (!this.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Connection Error");
            }
        }

        var strSQL = "select * from " + self.table ;
        var x = 0;
        for (var key in object){
            if (x++ > 0){
                strSQL += " and "
            }else{
                strSQL += " where ";
            }
            strSQL += key + "  " + object[key];
        }
        this.runQuery(strSQL, cb);
    },
    findOne: function(obj,cb){
        var self = this;
        if (!self.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Error");
            }
        }
        if (!obj['id'])
            return cb(null, null);
        var strSQL = "select * from " + self.table + " where id=" + obj['id'];
        self.runQuery(strSQL, cb);
    },
    insert: function(object,cb){
        var self = this;
        if (!self.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Error");
            }
        }

        var strSQL = "insert into " + self.table + " (";
        var x =0;
        for (var key in object){
            if (x++ > 0){
                strSQL += ","
            }else{
                strSQL += "";
            }
            strSQL += key + " "
        }
        strSQL += ") values (";

        x = 0;
        for (key in object){
            if (x++ > 0){
                strSQL += ",'"
            }else{
                strSQL += "'";
            }
            strSQL += object[key] + "'";
        }
        strSQL += ")";
        self.runCUDQuery(strSQL, cb);
    },
    update: function(object,cb){
        var self = this;
        if (!self.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Error");
            }
        }

        var strSQL = "update " + self.table + " set ";
        var x = 0;
        for (var key in object)
        {
            if (key.toLowerCase() == "id" 
            || key.toLowerCase() == "createdon" 
            || key.toLowerCase() == "createdby" 
            || key.toLowerCase() == "updatedon" 
            || key.toLowerCase() == "updateby"){continue;}
            if (x++ > 0){
                strSQL += ","
            }

            if (object[key]){
            strSQL += key + "='" + object[key] + "' ";
            }else{
                strSQL += key + "=" + object[key] + " ";
            }
        }
        strSQL += " where ID='" + object['id'] + "' ";
        self.runCUDQuery(strSQL, cb);
    },
    updateWithCompare: function(originalObj, newObj, cb){
        var self = this;
        if (!self.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Error");
            }
        }
        var x = 0;
        var strSQL = "update " + self.table + " set ";
        for (var key in originalObj){
            if (key.toLowerCase() == "id" 
            || key.toLowerCase() == "createdon" 
            || key.toLowerCase() == "createdby" 
            || key.toLowerCase() == "updatedon" 
            || key.toLowerCase() == "updateby") //If we find one of these, move on
            {
                continue;
            }
            if (originalObj[key] || newObj[key]){ //If both of them are null, move on
                if (originalObj[key] && newObj[key] && originalObj[key] === newObj[key]){
                    continue;
                }else{
                    if (x++ > 0){
                        strSQL += ",";
                    }
                    if (!newObj[key]){ //If the new one is undefined, set it to null
                        strSQL += key + " = NULL ";
                    }else{
                        strSQL += key + " = '" + newObj[key] + "' ";
                    }
                }
            }
        }
        strSQL += " where ID='" + originalObj['id'] + "' ";
        if (x < 1){
            return cb(null, originalObj);
        }
        else{
            self.runCUDQuery(strSQL, cb);
        }
    },
    remove: function(object,cb){
        var self = this;
        if (!self.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Error");
            }
        }

        var strSQL = "delete from " + self.table;
        var x = 0;
        strSQL += " where ";
        strSQL += " id = " + object['id'] + " ";
        self.runCUDQuery(strSQL, cb);
    },
    count: function(object,cb){
        var self = this;
        if (!self.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Error");
            }
        }

        var strSQL = "select count(*) nasir from " + self.table ;
        var x = 0;
        for (var key in object){
            if (x++ > 0){
                strSQL += " and "
            }else{
                strSQL += " where ";
            }
            strSQL += key + " " + object[key] + " ";
        }
        self.runQuery(strSQL, cb);
    },
    exists: function(object, cb){
        if (!object || !object['id']){
            return cb(null, false);
        }
        var self = this;
        if (!self.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Error");
            }
        }

        self.count({'id':"=" + object['id']}, function(err, result){
            if (err){
                return cb(err, null);
            }else{
                if (result[0]['nasir'] > 0){
                    return cb(null, true);
                }else{
                    return cb(null, false);
                }
            }
        });
    },
    getName: function(obj,cb){
        var self = this;
        if (!this.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid connection Error");
            }
        }

        var strSQL = "select name from " + self.table + " where id=" + obj['id'];
        self.runQuery(strSQL, cb);
    },
    runQuery: function(sqlstring,cb){
        logger.info(sqlstring);
        if (!this.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid connection Error");
            }
        }
        //logger.log(sqlstring);
        this.connection.query(sqlstring, function(err, rows, fields){
            if (err){
                logger.error(err);
                return cb(err, null);
            }
            //logger.log("Outputting Recordset");
            return cb(null, rows);
        });
    },
    runCUDQuery: function(sqlstring,cb){
        logger.info(sqlstring);
        if (!this.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid connection Error");
            }
        }        
        //var cb = req.query['callback'];
        var retval = '';
        //var request = new sql.Request(this.connection);
        this.connection.query(sqlstring, function(err, rows, fields){
            if (err){
                logger.error('Error: ' + err);
                return cb(err, null);
            } 
            return cb(null, rows);
        });
    }
    /*
    runQuery: function(sqlstring,cb){
        var sqlconnection = new Connection(config);
        //var cb = req.query['callback'];
        var retval = '';
        sqlconnection.on('connect', function(err){
            var request;
            request = new Request(sqlstring, function(err, rowCount, rows) {
                if (err){
                    logger.log('Error');
                    sqlconnection.close();
                } else {
                    var rowarray = [];
                    var x=0;
                    rows.forEach(function(columns){
                        var rowdata = new Object();
                        logger.log(x++);
                        columns.forEach(function(column) {
                            rowdata[column.metadata.colName] = column.value;
                        });
                        rowarray.push(rowdata);
                    })
                    sqlconnection.close();
                    retval = JSON.stringify(rowarray);
                    logger.log(retval);
                    if (cb){
                        retval = cb + '(' + retval + ');'
                    }
                    //return retval;
                }
            });
            sqlconnection.execSql(request);
        });
    },
    runCUDQuery: function(sqlstring,cb){
        var sqlconnection = new Connection(config);
        //var cb = req.query['callback'];
        var retval = '';
        sqlconnection.on('connect', function(err){
            var request;
            request = new Request(sqlstring, function(err, rowCount) {
                if (err){
                    logger.log('Error');
                    sqlconnection.close();
                } else {
                    logger.log("Row Count: " + rowcount);
                    if (cb){
                        retval = cb + '(' + rowCount + ');'
                    }
                    //return retval;
                }
            });
            sqlconnection.execSql(request);
        });
    }*/

};

module.exports = MySQLTable;
