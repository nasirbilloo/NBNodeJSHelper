var MyVars = function () {
    this.DBTypes = {
        MySQL: "MySQL",
        SQLServer: "SQLServer"
    }

    /*
        this.DBTYPE = this.DBTypes.SQLServer;
        this.DBUSER = "FTJira2";
        this.DBPASS = "FTJira2";
        this.DBHOST = "127.0.0.1";
        this.DBINSTANCE = "SQLEXPRESS";
        this.DBDB = "FTJira2";
    */
    /*
        this.DBTYPE = this.DBTypes.SQLServer;
        this.DBUSER = "FTJira";
        this.DBPASS = "FTJira101";
        this.DBHOST = "ftjira2.cxnlzbtii9dt.us-east-1.rds.amazonaws.com";
        this.DBINSTANCE = "";
        this.DBDB = "FTJira2";
        this.MongoDB = 'mongodb://127.0.0.1/MyTitleApp2';
    */
    this.DBTYPE = this.DBTypes.MySQL;
    this.DBUSER = "titleuser";
    this.DBPASS = "TitlePass101";
    this.DBHOST = "mytitle-test.cryahbmd1jmi.us-east-1.rds.amazonaws.com";
    this.DBINSTANCE = "";
    this.DBDB = "TitleMan";
    this.MongoDB = 'mongodb://127.0.0.1/TitleMan';
    
    this.JWTSecret = "myTitle Secret!";
    
    this.farback = 5;
    this.farbackDate = new Date();
    this.farbackDate.setDate(this.farbackDate.getDate() + this.farback * -1);    
    this.sqlQueryTimeout = 5;
    this.mongoQueryTimeout = 3;
    this.calcTimeout = 100;
    
    this.runnerTimeout = 3600000; //1 hour
    this.runner2Timeout = this.runnerTimeout * 4; //4 hours 
    this.fullSynchTimeout = 604800000; //1 week
    this.connectionRetry = 5;
};

myVars = new MyVars();

module.exports = myVars;