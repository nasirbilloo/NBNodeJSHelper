'use strict';
var express = require('express');
var bodyparser = require('body-parser');
var expresslogger = require('./util/expressmiddleware/logger');

var logger = require('./util/logger');

var app = express();
//var logger = require('./services/log');

//app.use(expresslogger);
app.use(bodyparser.json());
//app.use(bodyparser.urlencoded({
//    extended: false
//}));
/*
app.use(express.static('../client', {
    index: 'index.html'
}));
app.use(express.static('../mobile/www', {
    index: 'index.html'
}));
*/
var path = require("path");
app.get('/', function (req, res) {
    var ua = req.header('user-agent');
    ua = ua.toLowerCase();
    console.log(ua);
    // Check the user-agent string to identyfy the device. 
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile|ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(ua)) {
        //res.sendfile(__dirname + '/../mobile/www/index.html');
        console.log("Mobile");
        app.use('/',express.static('../mobile/www'));
        res.sendFile(path.join(__dirname + '/../mobile/www/index.html'));
    } else {
        //res.sendfile(__dirname + '/../client/index.html');
        console.log("Web");
        app.use('/', express.static('../client'));
        res.sendFile(path.join(__dirname + '/../client/index.html'));
    }
});

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    //res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var authRoute = require('./routes/authRoute');
var adHocRoute = require('./routes/adHocReports');
//var jsonParser = bodyparser.json();
//var urlencoded = bodyparser.urlencoded({ extended: false });
//THIS MOTHERFUCKER IS THE SECRET SAUCE
//TO MAKING IONIC WORK ON THE SAME MACHINE
//WITH NODEJS
app.use(require('body-parser').json({ type: '*/*' }));

//LOGIN
app.use('/api/login', authRoute.login);
app.use('/api/logout', authRoute.logout);
app.use('/api/permissions', authRoute.permissions);
app.use('/api/isValidUser', authRoute.isValidUser);

//adHocReports
app.use('/api/report/adHocSQLQuery', adHocRoute.adHocSQLQuery);


//Crud
var usersRoute = require('./routes/usersRoute');
app.use('/api/forms/users', usersRoute);

//Crud
var usersAuthenticationRoute = require('./routes/usersAuthenticationRoute');
app.use('/api/forms/usersAuthentication', usersAuthenticationRoute);

//Crud
var userTypesRoute = require('./routes/userTypesRoute');
app.use('/api/forms/userTypes', userTypesRoute);

//Crud
var titleStatusesRoute = require('./routes/titleStatusesRoute');
app.use('/api/forms/titleStatuses', titleStatusesRoute);

//Crud
var titlesRoute = require('./routes/titlesRoute');
app.use('/api/forms/titles', titlesRoute);

//Crud
var titleMessagesRoute = require('./routes/titleMessagesRoute');
app.use('/api/forms/messages', titleMessagesRoute);

//Crud
var saleTypesRoute = require('./routes/saleTypesRoute');
app.use('/api/forms/saleTypes', saleTypesRoute);

//Crud
var propertyTypesRoute = require('./routes/propertyTypesRoute');
app.use('/api/forms/propertyTypes', propertyTypesRoute);

//Crud
var propertiesRoute = require('./routes/propertiesRoute');
app.use('/api/forms/properties', propertiesRoute);

//Crud
var accessRolesRoute = require('./routes/accessRolesRoute');
app.use('/api/forms/accessRoles', accessRolesRoute);

//Crud
var buyingRoute = require('./routes/buyingRoute');
app.use('/api/forms/buying', buyingRoute);

//Crud
var sellingRoute = require('./routes/sellingRoute');
app.use('/api/forms/selling', sellingRoute);

//lists
var listsRoute = require('./routes/listsRoute');
app.use('/api/forms/lists/accessRoles', listsRoute.accessRoles);
app.use('/api/forms/lists/propertyTypes', listsRoute.propertyTypes);
app.use('/api/forms/lists/saleTypes', listsRoute.saleTypes);
app.use('/api/forms/lists/userTypes', listsRoute.userTypes);
app.use('/api/forms/lists/titleStatuses', listsRoute.titleStatuses);
app.use('/api/forms/lists/buyers', listsRoute.buyers);
app.use('/api/forms/lists/sellers', listsRoute.sellers);
app.use('/api/forms/lists/properties', listsRoute.properties);

var server = app.listen(80, function () {
    logger.info("api listening on ", server.address().port);
})