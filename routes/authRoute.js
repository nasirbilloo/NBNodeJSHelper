'use strict';

var express = require('express');
var async = require('async');

var MyVars = require('../MyVars');

var RouteHelper = require('./routeHelper');
var routeHelper = new RouteHelper;
var routeError = routeHelper.routeError;
var routeSuccess = routeHelper.routeSuccess;
var processQuery = routeHelper.processQuery;
var jwt = require('jwt-simple');
var SQLConnection = require('../db/MySQLConnection');
var SQLQuery = require('../db/MySQLQuery');


var logger = require('../util/logger');


var getUser = function (username, cb) {
    var strSQL = "select * from people where id='" + username + "'";
    SQLConnection.getConnection(function (err, dbConn) {
        if (err) {
            return self.routeError(err, res);
        }
        var issueQuery = new SQLQuery(dbConn);
        issueQuery.query(strSQL, function (err, results) {
            dbConn.release();
            if (err) {
                logger.error(err);
                return cb(err);
            } else {
                if (!results || results.length < 0) {
                    return cb(null, "No Data Found");
                }
                return cb(null, results[0]);
            }
        });
    });
};

exports.login = function (req, res) {
    var auth = req.body;
    var username = auth.username;
    var password = auth.password;
    return authenticateUser(auth, res);
};

exports.permissions = function (req, res) {
    var fxn = req.query.fxn;
    if (!fxn) fxn = "";
    if (!req.headers.authorization) {
        console.error("Invalid Auth Headers");
        return routeHelper.routeSuccess({ "view": fxn, "permission": false }, res);
    }
    var token = req.headers.authorization.split(' ')[1];
    var payload = jwt.decode(token, MyVars.JWTSecret);

    if (!payload) {
        console.error("Invalid Auth Payload");
        return routeHelper.routeSuccess({ "view": fxn, "permission": false }, res);
    }

    var email = payload.sub;
    if (!email) {
        console.error("Invalid Email Address in Auth");
        return routeHelper.routeSuccess({ "view": fxn, "permission": false }, res);
    }
    if (!fxn || fxn == "") {
        getUserPermissions(email, function (err, result) {
            return routeHelper.routeSuccess(result, res);
        })
    } else {
        isUserPermitted(email, fxn, function (err, result) {
            return routeHelper.routeSuccess({ "view": fxn, "permission": result }, res);
        });
    }
}
var getUserPermissions = function (email, cb) {
    var strSQL = "select title_view.name as view, true as permission\
        from user, view_permission, title_view         \
        where email='" + email + "'         \
        and user.user_access = view_permission.access_role_id \
        and view_permission.view_id = title_view.id" ;

    SQLConnection.getConnection(function (err, dbConn) {
        if (err) {
            return self.routeError(err, res);
        }
        var issueQuery = new SQLQuery(dbConn);
        issueQuery.query(strSQL, function (err, results) {
            dbConn.release();
            if (err) {
                logger.error(err);
                return cb(err);
            } else {
                if (!results || results.length < 0) {
                    return cb(null, null);
                }
                processPermissions(email, results, cb)
                //return cb(null, results);
            }
        });
    });
}
var isBuying = function (email, cb) {
    var strSQL = "select count(*) as count\
        from title, user \
        where title.buyer = user.id \
        and user.email = '" + email + "' ";
    routeHelper.getQuery(strSQL, function (err, result) {
        if (err) {
            cb(err);
        } else {
            if (!result || result.length < 0) {
                cb(null);
            } else {
                if (result[0].count > 0) {
                    cb(null, true);
                } else {
                    cb(null, false);
                }
            }
        }
    });
}
var isSelling = function (email, cb) {
    var strSQL = "select count(*) as count\
        from title, user \
        where title.seller = user.id \
        and user.email = '" + email + "' ";
    routeHelper.getQuery(strSQL, function (err, result) {
        if (err) {
            cb(err);
        } else {
            if (!result || result.length < 0) {
                cb(null);
            } else {
                if (result[0].count > 0) {
                    cb(null, true);
                } else {
                    cb(null, false);
                }
            }
        }
    });
}
var processPermissions = function (email, permissions, cb) {
    /*
        if buying or selling, true only if buying or selling
    */
    async.eachSeries(permissions, function (permission, callback) {
        if (permission.view == "buying") {            
            isBuying(email, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    permission.permission = result;
                    callback();
                }
            });
        } else if (permission.view == "selling") {
            isSelling(email, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    permission.permission = result;
                    callback();
                }
            });
        } else {
            callback();
        }
    }, function (err) {
        if (err) {
            cb(err);
        } else {
            cb(null, permissions);
        }
    })
}
var isUserPermitted = function (email, strFxn, cb) {
    var strSQL = "select count(view_permission.view_id) as count \
        from user, view_permission, title_view \
        where email='" + email + "' \
        and user.user_access = view_permission.access_role_id \
        and view_permission.view_id = title_view.id \
        and title_view.name='" + strFxn + "' ";
    SQLConnection.getConnection(function (err, dbConn) {
        if (err) {
            return self.routeError(err, res);
        }
        var issueQuery = new SQLQuery(dbConn);
        issueQuery.query(strSQL, function (err, results) {
            dbConn.release();
            if (err) {
                logger.error(err);
                return cb(err);
            } else {
                if (!results || results.length < 0) {
                    return cb(null, false);
                }
                return cb(null, true ? results[0].count > 0 : false);
            }
        });
    });
};
var authenticateUser = function (auth, res) {
    //If email and password match a record in DB...
    var UserProfile = require('../models/MySQLModels/User.js');
    UserProfile.getSome({ 'email': "='" + auth.username + "'", 'password': "='" + auth.password + "'" }, function (err, user) {
        if (user && user.length == 1) {
            return createSendToken(user[0], res);
        } else {
            return sendAuthError(res, "Invalid username/password");
        }
    });

    //else return authError...
}
var getUserRole = function (user_access, cb) {
    var strSQL = "select name from access_role where id='" + user_access + "'";
    SQLConnection.getConnection(function (err, dbConn) {
        if (err) {
            return self.routeError(err, res);
        }
        var issueQuery = new SQLQuery(dbConn);
        issueQuery.query(strSQL, function (err, results) {
            dbConn.release();
            if (err) {
                logger.error(err);
                return cb(err);
            } else {
                if (!results || results.length < 0) {
                    return cb(null, "No Data Found");
                }
                return cb(null, results[0]);
            }
        });
    });
};
var createSendToken = function (user, res) {
    getUserRole(user.user_access, function (err, userRole) {
        if (err) {
            sendAuthError(res, "Invalid User Role");
        } else {
            var obj = {
                userid: user.id,
                email: user.email,
                name: user.name,
                role: userRole.name,
                token: createJWTToken(user.email)
            };
            res.status(200).send(obj);
        }
    });
};

var createJWTToken = function (user) {
    var exp = new Date();
    exp.setMinutes(exp.getMinutes() + 1440 * 5); // Expires in 5 days
    var payload = {
        sub: user,
        exp: exp.getTime()
    }
    return jwt.encode(payload, MyVars.JWTSecret);
};
/*
var isAuthenticated = function (req, res) {
    if (!req.headers.authorization) {
        return sendAuthError(res, 'Invalid Logout Attempt');
    }
    var token = req.headers.authorization.split(' ')[1];
    return isValidToken(token);
};
var isValidToken = function (token) {
    var payload = jwt.decode(token, MyVars.JWTSecret);

    if (!payload) {
        return false;
    }

    var email = payload.sub;
    var exp = payload.exp;
    if (!email) {
        return false;
    }
    var now = new Date();
    if (exp < now.getTime()) {
        return false;
    }
    return true;
};
*/

//module.exports = router;
