'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});


var SimpleCrudHandler = function (model) {
    this.RouteModel = model;
    this.routeHelper = require('./RouteHelper');
};


SimpleCrudHandler.prototype = {
    get: function (request, response) {
        var self = this;
        self.RouteModel.getAll(function (err, results) {
            if (err) {
                console.log(err);
                return self.routeHelper.routeError(err, response);
            } else {
                return self.routeHelper.routeSuccess(results, response);
            }
        });
    },
    getWithID: function (itemIDName, request, response) {
        var self = this;
        var itemID = request.params[itemIDName];
        self.RouteModel.getWithID(itemID, itemIDName, function (err, results) {
            if (err) {
                console.log(err);
                return self.routeHelper.routeError(err, response);
            } else {
                return self.routeHelper.routeSuccess(results, response);
            }
        });
    },
    post: function (request, response) {
        var self = this;
        var data = request.body;

        self.RouteModel.exists(data, function (err, existingData) {
            //console.log("insertOrUpdate");
            if (err) { //Error in exists query
                return self.routeHelper.routeError("Error in db query statement\n" + err, response);
            } else {
                if (!existingData || existingData.length < 1) { //Doesn't Existt, New
                    return self.RouteModel.insert(data, function (err, result) {
                        if (err) {
                            return self.routeHelper.routeError("Error in insert statement, unable to insert\n" + err, response);
                        }
                        return self.routeHelper.routeSuccess(result, response)
                    });

                } else { //Exists / Modify
                    return self.RouteModel.update(data, function (err, result) {
                        if (err) {
                            return self.routeHelper.routeError("Error in update statement, unable to update\n" + err, response);
                        }
                        return self.routeHelper.routeSuccess(result, response)
                    });
                }
            }
        });
    },
    put: function (request, response) {
        var self = this;
        var data = request.body;
        self.RouteModel.removeSimple(data, function (err, results) {
            if (err) {
                console.error(err);
                return self.routeHelper.routeError(err, response);
            } else {
                return self.routeHelper.routeSuccess(results, response);
            }
        });
    }
}

module.exports = SimpleCrudHandler;