'use strict';

var RouteHelper = require("routeHelper");
var SimpleCrudHandler = require("SimpleCrudHandler");
var AuthHelper = require("AuthHelper");

var RouteFactory = function () {
    this.routeHelper = RouteHelper;
    this.authHelper = AuthHelper;
}
RouteFactory.prototype = {
};


routeFactory = new RouteFactory();

module.exports = routeFactory;