'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

var RouteHelper = require('./routeHelper');
var routeHelper = new RouteHelper;
var routeError = routeHelper.routeError;
var routeSuccess = routeHelper.routeSuccess;
//var getAuthorizedUser = routeHelper.getAuthorizedUser;

var SimpleCrudHandler = function(model) {
    this.RouteModel = model;
};


SimpleCrudHandler.prototype = {
    get: function(request, response) {
        var self = this;
        self.RouteModel.getAll(function(err, results) {
            if (err) {
                return routeError(err, response);
            } else {
                return routeSuccess(results, response);
            }
        });
    },
    getWithID: function(itemIDName, request, response){
        var self = this;
        var itemID = request.params[itemIDName];
        self.RouteModel.getWithID(itemID, itemIDName, function(err, results) {
            if (err) {
                return routeError(err, response);
            } else {
                return routeSuccess(results, response);
            }
        });
    },
    post: function(request, response) {
        var self = this;
        var data = request.body;
        self.RouteModel.insertOrUpdate(data, function(err, results) {
            if (err) {
                return routeError("Error in insert statement, unable to insert", response);
            } else {
                return routeSuccess(results, response);
            }
        });
    },
    put: function(request, response) {
        var self = this;
        var data = request.body;
        self.RouteModel.removeSimple(data, function(err, results) {
            if (err) {
                console.error(err);
                return routeError(err, response);
            } else {
                return routeSuccess(results, response);
            }
        });
    }
}

module.exports = SimpleCrudHandler;