'use strict'

var jwt = require('jwt-simple');
var DBConnectionFactory = require('@nasirb/nbnodejsdb/DBConnectionFactory');

var Authenticationelper = function (authConfig) {
    this.authConfig = authConfig;
    this.routeHelper = require('./RouteHelper');
}
Authenticationelper.prototype = {
    setAuthConfig: function (authConfig) {
        this.authConfig = authConfig;
    },
    isAuthenticated: function (req, res) {
        if (!req.headers.authorization) {
            return false;
        }
        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, this.authConfig.JWTSecret);

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
        var self = this;
        if (!req.headers.authorization) {
            console.error("Invalid Auth Headers");
            return cb("Invalid Auth Headers");
        }
        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, self.authConfig.JWTSecret);

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
        if (!req.headers.authorization) {
            return this.routeHelper.sendAuthError(res, 'Invalid Logout Attempt');
        }

        return this.routeHelper.sendAuthSuccess(res, 'Logout Successful');
    },
    login: function (req, res) {
        var auth = req.body;
        var username = auth.username;
        var password = auth.password;
        return this.authenticateUser(auth, res);
    },
    authenticateUser: function (auth, res) {
        var self = this;
        var strSQL = "select user.id, concat(user.first_name, ' ', user.last_name) as name, \
        user.email, access_role.name as role \
        from user, access_role \
        where user.email = '" + auth.username + "' and user.password='" + auth.password + "' \
        and user.user_access = access_role.id ";
        DBConnectionFactory.executeSQLQuery(strSQL, function (err, user) {
            if (err) {
                throw Error("AuthenticationHelper - AuthenticateUser: \n" + err);
            }

                if (user && user.length == 1) {
                    return self.createSendToken(user[0], res);
                } else {
                    //else return authError...                    
                    return self.routeHelper.sendAuthError(res, "Invalid username/password");
                }
            });
    },
    createSendToken: function (user, res) {
        var self = this;
        var obj = {
            userid: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            token: self.createJWTToken(user.email)
        };
        res.status(200).send(obj);
    },
    createJWTToken: function (user) {
        var self = this;
        var exp = new Date();
        exp.setMinutes(exp.getMinutes() + 1440 * 5); // Expires in 5 days
        var payload = {
            sub: user,
            exp: exp.getTime()
        }
        return jwt.encode(payload, self.authConfig.JWTSecret);
    }
};


var authHelper = new Authenticationelper();

module.exports = authHelper;