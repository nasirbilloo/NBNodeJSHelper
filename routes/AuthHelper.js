'use strict'

var jwt = require('jwt-simple');

var AuthHelper = function (authObj) {
    this.authObj = authObj;
}
AuthHelper.prototype = {
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
    sendAuthError: function (res, message) {
        res.status(403).send({
            message: message
        });
    },
    sendAuthSuccess: function (res, message) {
        res.status(200).send({
            message: message
        });
    },
    logout: function (req, res) {
        var self = this;
        if (!req.headers.authorization) {
            return self.sendAuthError(res, 'Invalid Logout Attempt');
        }

        return self.sendAuthSuccess(res, 'Logout Successful');
    },
    isValidUser: function (req, res) {
        if (routeHelper.isAuthenticated(req, res)) {
            routeHelper.routeSuccess({ isValid: true }, res);
        } else {
            routeHelper.routeSuccess({ isValid: false }, res);
        }
    }
};


authHelper = new AuthHelper();

module.exports = authHelper;