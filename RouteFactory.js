'use strict';

var RouteHelper = require("./routeHelper");
var SimpleCrudHandler = require("./SimpleCrudHandler");
var AuthenticationHelper = require("./AuthenticationHelper");
var AuthorizationHelper = require("./AuthorizationHelper");

var RouteFactory = function () {
    this.routeHelper = RouteHelper;
    this.authenticationHelper = AuthenticationHelper;
    this.authorizationHelper = AuthorizationHelper;    
}
RouteFactory.prototype = {
};


var routeFactory = new RouteFactory();

module.exports = routeFactory;