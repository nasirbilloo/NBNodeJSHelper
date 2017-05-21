'use strict'

var jwt = require('jwt-simple');
var DBConnectionFactory = require('@nasirb/nbnodejsdb/DBConnectionFactory');

var AuthorizationHelper = function (authConfig) {
    this.authConfig = authConfig;
    this.routeHelper = require('./RouteHelper');
    this.authenticationHelper = require('./AuthenticationHelper');
}
AuthorizationHelper.prototype = {
    setAuthConfig: function (authConfig) {
        this.authConfig = authConfig;
    },

    isValidUser: function (req, res) {
        var self = this;
        if (self.authenticationHelper.isAuthenticated(req, res)) {
            self.routeHelper.routeSuccess({ isValid: true }, res);
        } else {
            self.routeHelper.routeSuccess({ isValid: false }, res);
        }
    },
    getUser: function (username, cb) {
        var strSQL = "select * from people where id='" + username + "'";
        self.RouteHelper.getQuery(strSQL, function (err, issueQuery) {
                if (!results || results.length < 0) {
                    return cb(null, "No Data Found");
                }
                return cb(null, results[0]);
        });
    },
    getPermissions: function (req, res) {
        var self = this;

        var fxn = req.query.fxn;
        if (!fxn) fxn = "";
        self.authenticationHelper.getEmailFromToken(req, res, function (err, email) {
            if (err) {
                return self.routeHelper.routeSuccess({ "view": fxn, "permission": false }, res);
            } else {
                if (!fxn || fxn == "") {
                    self.getUserPermissions(email, function (err, result) {
                        return self.routeHelper.routeSuccess(result, res);
                    })
                } else {
                    self.isUserPermitted(email, fxn, function (err, result) {
                        return self.routeHelper.routeSuccess({ "view": fxn, "permission": result }, res);
                    });
                }
            }
        })
    },
    getUserPermissions: function (email, cb) {
        var self = this;

        var strSQL = "select app_view.name as view, true as permission\
        from user, view_permission, app_view         \
        where email='" + email + "'         \
        and user.user_access = view_permission.access_role_id \
        and view_permission.view_id = app_view.id" ;
        self.routeHelper.getQuery(strSQL, cb);
    },
    isUserPermitted: function (email, strFxn, cb) {
        var self = this;

        var strSQL = "select count(view_permission.view_id) as count \
        from user, view_permission, app_view \
        where email='" + email + "' \
        and user.user_access = view_permission.access_role_id \
        and view_permission.view_id = app_view.id \
        and app_view.name='" + strFxn + "' ";
        self.routeHelper.getQuery(strSQL,function (err, issueQuery) {
                if (!results || results.length < 0) {
                    return cb(null, false);
                }
                return cb(null, true ? results[0].count > 0 : false);
        });
    },
/*    
    isBuying: function (email, cb) {
        var strSQL = "select count(*) as count\
        from title, user \
        where title.buyer = user.id \
        and user.email = '" + email + "' ";
        self.routeHelper.getQuery(strSQL, function (err, result) {
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
    },
    isSelling: function (email, cb) {
        var strSQL = "select count(*) as count\
        from title, user \
        where title.seller = user.id \
        and user.email = '" + email + "' ";
        self.routeHelper.getQuery(strSQL, function (err, result) {
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
*/    
    /*
        if buying or selling, true only if buying or selling
    */
    /*        
        processPermissions: function (email, permissions, cb) {
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
    */
};


var authHelper = new AuthorizationHelper();

module.exports = authHelper;