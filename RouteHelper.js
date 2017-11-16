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
    authError: function (message, res) {
        res.status(403).send({
            message: message
        });
    },
    sendAuthError: function (res, message) {
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
        var dtTemp = new Date(dt)
        return dtTemp.getFullYear() + "/" 
        + (dtTemp.getMonth() + 1) + "/" 
        + dtTemp.getDate() + " " 
        + dtTemp.getHours() + ":" 
        + dtTemp.getMinutes() + ":" 
        + dtTemp.getSeconds();
    },
    getLocalDBDateTimeString: function (dt) {
        var dtTemp = new Date(dt);
        var tzOffset = dtTemp.getTimezoneOffset() * 60 * 1000;
        dtTemp = new Date(dtTemp.setTime(dtTemp.getTime() + tzOffset));
        return dtTemp.getFullYear() + "/" 
        + (dtTemp.getMonth() + 1) + "/" 
        + dtTemp.getDate() + " " 
        + dtTemp.getHours() + ":" 
        + dtTemp.getMinutes() + ":" 
        + dtTemp.getSeconds();  
    },    
    getDBDateString: function (dt) {
        var dtTemp = new Date(dt)
        return dtTemp.getFullYear() + "/" + (dtTemp.getMonth() + 1) + "/" + dtTemp.getDate();
    },
    getDBDateStringSt: function (dt) {
        var dtTemp = new Date(dt)
        var y = dtTemp.getFullYear();
        var m = dtTemp.getMonth() < 9 ? "0" + (dtTemp.getMonth() + 1) : (dtTemp.getMonth() + 1);
        var d = dtTemp.getDate() < 10 ? "0" + dtTemp.getDate() : dtTemp.getDate();
        return "{ts '" + y + "-"
            + m + "-"
            + d + " 00:00:00'}";
    },
    getDBDateStringEn: function (dt) {
        var dtTemp = new Date(dt)
        var y = dtTemp.getFullYear();
        var m = dtTemp.getMonth() < 9 ? ("0" + (dtTemp.getMonth() + 1)) : ((dtTemp.getMonth() + 1));
        var d = dtTemp.getDate() < 10 ? ("0" + dtTemp.getDate()) : (dtTemp.getDate());
        return "{ts '" + y + "-"
            + m + "-"
            + d + " 23:59:59'}";
    },
    getUTCDBDateStringEn: function (dt) {
        var dtTemp = new Date(dt)
        dtTemp.setHours(23);
        dtTemp.setMinutes(59);
        dtTemp.setSeconds(59);

        var y = dtTemp.getUTCFullYear();
        var m = dtTemp.getUTCMonth() < 9 ? ("0" + (dtTemp.getUTCMonth() + 1)) : ((dtTemp.getUTCMonth() + 1));
        var d = dtTemp.getUTCDate() < 10 ? ("0" + dtTemp.getUTCDate()) : (dtTemp.getUTCDate());
        return "{ts '" + y + "-"
            + m + "-"
            + d + " 23:59:59'}";
    },    
    processQuery: function (strSQL, req, res) {
        var self = this;

        DBConnectionFactory.executeSQLQuery(strSQL, function (err, results) {
            if (err) {
                return self.routeError(err, res);
            } else {
                return self.routeSuccess(results, res);
            }
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
    dateAddDays: function (dt, days) {
        var dtTemp = new Date(dt);
        return new Date(dtTemp.setTime(dtTemp.getTime() + days * 86400000));
    },
    getStringVar: function (varName, req) {
        var data = req.query[varName];
        if (!data) {
            return "";
        }
        return data;
    },
    getDBArraySting: function (arr) {
        var ret = "";
        for (var x = 0; x < arr.length; x++) {
            if (x > 0) {
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
    sequalizeString: function (val) {
        val = this.replaceAll("'", "`", val);
        /*
        val = val.replace(/[\0\n\r\b\t\\'"\x1a]/g, function (s) {
            switch (s) {
            case "\0":
                return "\\0";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\b":
                return "\\b";
            case "\t":
                return "\\t";
            case "\x1a":
                return "\\Z";
            case "'":
                return "''";
            case '"':
                return '""';
            default:
                return "\\" + s;
            }
        });
        */
        return val;
    },
    sequalizeAndTrim: function (val, n) {
        if (!n)
            n = 100;
        return val && typeof val === "string" ? this.sequalizeString(val).substring(0, n) : null;
    },
}

var routeHelper = new RouteHelper();
module.exports = routeHelper;