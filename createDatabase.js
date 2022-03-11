const connectionDB_new = require('./db');

let sqlStatements = [];
sqlStatements.push("CREATE TABLE IF NOT EXISTS `users` ( `id` INT(10) NOT NULL AUTO_INCREMENT key, `user_name` VARCHAR(255) NOT NULL , `password` VARCHAR(255) NOT NULL , `user_type` TEXT NOT NULL , `email` VARCHAR(255) NOT NULL );");
sqlStatements.push("CREATE TABLE IF NOT EXISTS `investment` ( `hash` VARCHAR(255) NOT NULL, `index` INT(10) NOT NULL, `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL);");
sqlStatements.push("CREATE TRIGGER IF NOT EXISTS investment_create BEFORE INSERT ON `investment` FOR EACH ROW SET NEW.created_at = NOW(), NEW.updated_at = NOW();");
sqlStatements.push("CREATE TRIGGER IF NOT EXISTS investment_update BEFORE UPDATE ON `investment` FOR EACH ROW SET NEW.updated_at = NOW(), NEW.created_at = OLD.created_at;");

sqlStatements.forEach(sqlStatement => {
    connectionDB_new.query(sqlStatement, function (err, result) {
    if (err) throw err;
        console.log("Statement executed !!!" + sqlStatement);
    });
});
