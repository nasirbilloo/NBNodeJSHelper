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
        this.MongoDB = 'mongodb://127.0.0.1/JiraNasir2';
    */
    this.DBTYPE = this.DBTypes.SQLServer;
    this.DBUSER = "JiraNasir";
    this.DBPASS = "ThisIsMyPassword0112";
    this.DBHOST = "jiranasirse.cxnlzbtii9dt.us-east-1.rds.amazonaws.com";
    this.DBINSTANCE = "";
    this.DBDB = "JiraNasir";
    this.MongoDB = 'mongodb://127.0.0.1/JiraNasir3';
    
    this.JiraUserName = "nasir.billoo";
    this.JiraPassword = "FocusTech1234";
    this.JiraURL = "https://focustech.atlassian.net/";


    this.JWTSecret = "FTJira Secret!";
    
    this.farback = 30;
    this.farbackDate = new Date();
    this.farbackDate.setDate(this.farbackDate.getDate() + this.farback * -1);    
    this.sqlQueryTimeout = 5;
    this.mongoQueryTimeout = 3;
    this.calcTimeout = 50;
    this.restCallTimeout = 500;    
    this.changelogTimeout = 50;
    this.commentTimeout = 25;

    this.runnerTimeout = 7200000; //Once every two hour
    this.runner2Timeout = 86400000; // Once a Day
    this.fullSynchTimeout = 604800000; //Once a week
    this.connectionRetry = 5;
};

myVars = new MyVars();

module.exports = myVars;