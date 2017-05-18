'use strict';

var DBConnectionFactory = require('@nasirb/nbnodejsdb/DBConnectionFactory');

var RouteHelper = function () {
};

RouteHelper.prototype = {

    routeError: function (err, res) {
        return res.status(401).send({
            message: err
        });
    },

    authError: function (res, message) {
        res.status(403).send({
            message: message
        });
    },

    routeSuccess: function (result, res) {
        return res.status(200).send(result);
    },
    sendAuthSuccess: function (res, message) {
        res.status(200).send({
            message: message
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
    
    getDBDateTimeString: function (dt) {
        return dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    },
    getDBDateString: function (dt) {
        return dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
    },
    getDBDateStringSt: function (dt) {
        var y = dt.getFullYear();
        var m = dt.getMonth() < 9 ? "0" + (dt.getMonth() + 1) : (dt.getMonth() + 1);
        var d = dt.getDate() < 9 ? "0" + dt.getDate() : dt.getDate();
        return "{ts '" + y + "-" 
        + m  + "-" 
        + d + " 00:00:00'}";
    },
    getDBDateStringEn: function (dt) {
        var y = dt.getFullYear();
        var m = dt.getMonth() < 9 ? ("0" + (dt.getMonth() + 1)) : ((dt.getMonth() + 1));
        var d = dt.getDate() < 9 ? ("0" + dt.getDate()) : (dt.getDate());
        return "{ts '" + y + "-" 
        + m  + "-" 
        + d + " 23:59:59'}";
    },       
    processQuery: function (strSQL, req, res) {
        var self = this;

        DBConnectionFactory.getSQLQuery(function (err, issueQuery) {
            if (err) {
                return self.routeError(err, res);
            }
            issueQuery.query(strSQL, function (err, results) {
                dbConn.release();
                if (err) {
                    return self.routeError(err, res);
                } else {
                    return self.routeSuccess(results, res);
                }
            });
        });
    },
    getQuery: function (strSQL, cb) {
        var self = this;

        DBConnectionFactory.getSQLQuery(function (err, issueQuery) {
            if (err) {
                return cb(err);
            }

            issueQuery.query(strSQL, function (err, results) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, results);
                }
            });
        });
    },
    replaceAll: function (find, replace, str) {
        if (typeof str === "string") {
            return str.replace(new RegExp(find, 'g'), replace);
        } else return str;
    },
    isValidDate: function (dt) {
        return dt instanceof Date && !isNaN(dt.valueOf());
    },
    dateAddDays: function(dt, days){
        var dtTemp = new Date(dt);
        return new Date(dtTemp.setTime(dtTemp.getTime() + days * 86400000 ));
    },
    getStringVar: function (varName, req) {
        var data = req.query[varName];
        if (!data) {
            return "";
        }
        return data;
    },
    getDBArraySting: function(arr){
        var ret = "";
        for (var x=0; x<arr.length; x++){
            if (x >0){
                ret += ",";
            }
            ret += "'" + arr[x] + "'";
        }
        return ret;
    },
    getBooleanVar: function (varName, req) {
        var data = req.query[varName];
        if (typeof data != 'undefined') {
            if (data === "true") {
                data = true;
            } else {
                data = false;
            }
        }
        if (!data) {
            return false;
        }
        return true;
    },
    getIntVar: function (varName, req) {
        var data = req.query[varName];
        if (!data) {
            return 0;
        }
        if (isNaN(data)) {
            return 0;
        }
        return data;
    },
    getDateVar: function (varName, req) {
        var data = req.query[varName];
        if (!data) {
            return new date;
        }
        data = new Date(parseInt(data));
        return data;
    },
    getStartDate: function (req) {
        var startDate = req.query.startDate;
        if (!startDate || startDate == "") {
            startDate = new Date();
            startDate.setFullYear(startDate.getFullYear(), startDate.getMonth(), 1);
        } else {
            startDate = new Date(parseInt(startDate));
        }
        return startDate;
    },
    getEndDate: function (req) {
        var endDate = req.query.endDate;

        if (!endDate || endDate == "") {
            endDate = new Date();
            endDate.setFullYear(endDate.getFullYear(), endDate.getMonth() + 1, 0);
        } else {
            endDate = new Date(parseInt(endDate));
        }
        return endDate;
    },
}
/*
module.exports.routeError = routeError;
module.exports.authError = authError;
module.exports.routeSuccess = routeSuccess;
module.exports.getDBDateTimeString = getDBDateTimeString;
module.exports.getDBDateString = getDBDateString;
module.exports.processQuery = processQuery;
module.exports.replaceAll = replaceAll;
module.exports.isAuthenticated = isAuthenticated;
module.exports.getStartDate = getStartDate;
module.exports.getEndDate = getEndDate;
module.exports.getBooleanVar = getBooleanVar;
module.exports.getIntVar = getIntVar;
module.exports.getDateVar = getDateVar;
module.exports.getStringVar = getStringVar;


//module.exports.getAuthorizedUser = getAuthorizedUser;
*/
var routeHelper = new RouteHelper();
module.exports = routeHelper;