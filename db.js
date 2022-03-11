var mysql = require('mysql');

var connectionDB = mysql.createConnection({
    host: "",
    user: "",
    password: "",
    database: ""
});

connectionDB.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected...");
});

module.exports = connectionDB;
