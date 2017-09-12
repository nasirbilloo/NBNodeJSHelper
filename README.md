# NBNodeJSHelper
Node JS Helper Files for Nasir's projects

A bunch of utilities

RouteHelper: a helper class with utility functions
AuthFactory: a holder for two calsses AuthenticationHelper and AuthorizationHelper
AuthenticationHelper: a Simple JWT wrapper
AuthorizationHelper: Assuming a certain db structure, this one can help fetch authorizations
DBSQLLoader: Loads a bunch of records to a SQL Table
DBMongoLoader: Loads a bunch of recors to Mongo
LoggerFactory: gets a logger based on given parameters. Uses Winston for logging
SimpleCrudHandler: A CRUD manager, given a GenerSimpleTableModel, scaffolds basic CRUD api

Todo: Support Promises and event listeners and not just callbacks
