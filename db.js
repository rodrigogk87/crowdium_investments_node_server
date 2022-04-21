var mysql = require('mysql');

var connectionDB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "restful_api"
});

connectionDB.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected...");
});

module.exports = connectionDB;
