'use strict'

var jwt = require('jwt-simple');
var DBConnectionFactory = require('@nasirb/nbnodejsdb/DBConnectionFactory');

var Authenticationelper = function (authObj) {
    this.authObj = authObj;
    this.logger = require('LoggerFactory').getLogger();
    this.routeHelper = require('RouteFactory').routeHelper;
}
Authenticationelper.prototype = {
    setAuthObj: function (authObj) {
        this.authObj = authObj;
    },
    isAuthenticated: function (req, res) {
        if (!req.headers.authorization) {
            return false;
        }
        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, this.authObj.JWTSecret);

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
    },
    getEmailFromToken: function (req, res, cb) {
        if (!req.headers.authorization) {
            console.error("Invalid Auth Headers");
            return cb("Invalid Auth Headers");
        }
        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, MyVars.JWTSecret);

        if (!payload) {
            console.error("Invalid Auth Payload");
            return cb("Invalid Auth Payload");
        }

        var email = payload.sub;
        if (!email) {
            console.error("Invalid Email Address in Auth");
            return cb("Invalid Email Address in Auth");
        }
        return cb(null, email);
    },
    logout: function (req, res) {
        var self = this;
        if (!req.headers.authorization) {
            return self.sendAuthError(res, 'Invalid Logout Attempt');
        }

        return self.sendAuthSuccess(res, 'Logout Successful');
    },
    login: function (req, res) {
        var auth = req.body;
        var username = auth.username;
        var password = auth.password;
        return self.authenticateUser(auth, res);
    },
    authenticateUser: function (auth, res) {
        var self = this;
        DBConnectionFactory.getModel('user', null, function (err, UserProfile) {
            if (err) {
                throw error(err);
            }

            //If email and password match a record in DB...
            UserProfile.getSome({ 'email': "='" + auth.username + "'", 'password': "='" + auth.password + "'" }, function (err, user) {
                if (user && user.length == 1) {
                    return createSendToken(user[0], res);
                } else {
                    //else return authError...                    
                    return sendAuthError(res, "Invalid username/password");
                }
            });
        });
    },
    getUserRole: function (user_access, cb) {
        var strSQL = "select name from access_role where id='" + user_access + "'";
        DBConnectionFactory.getSQLQuery(function (err, issueQuery) {
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
    },
    createSendToken: function (user, res) {
        var self = this;
        self.getUserRole(user.user_access, function (err, userRole) {
            if (err) {
                sendAuthError(res, "Invalid User Role");
            } else {
                var obj = {
                    userid: user.id,
                    email: user.email,
                    name: user.name,
                    role: userRole.name,
                    token: self.createJWTToken(user.email)
                };
                res.status(200).send(obj);
            }
        });
    },
    createJWTToken: function (user) {
        var exp = new Date();
        exp.setMinutes(exp.getMinutes() + 1440 * 5); // Expires in 5 days
        var payload = {
            sub: user,
            exp: exp.getTime()
        }
        return jwt.encode(payload, self.authObj.JWTSecret);
    }
};


authHelper = new Authenticationelper();

module.exports = authHelper;