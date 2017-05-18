'use strict';

var AuthenticationHelper = require("./AuthenticationHelper");
var AuthorizationHelper = require("./AuthorizationHelper");

var AuthFactory = function () {
    this.authenticationHelper = AuthenticationHelper;
    this.authorizationHelper = AuthorizationHelper;
    this.authConfig = null;
}
AuthFactory.prototype = {
    setAuthConfig: function(authConfig){
        this.authConfig = authConfig;
        this.authenticationHelper.setAuthConfig(authConfig);
        this.authorizationHelper.setAuthConfig(authConfig);
    }
};


var authFactory = new AuthFactory();

module.exports = authFactory;