const sqlite3 = require('sqlite3').verbose();
const chalk = require('chalk');
const { DB_FILE } = require('../config');

const db = new sqlite3.Database(DB_FILE,sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log(chalk.red("Error, conexión fallida a la base de datos"));
        process.exit(-1)
    } else {
        db.get("PRAGMA foreign_keys = ON")
        console.log(chalk.green("Conexión exitosa a la base de datos"))
    }
});

module.exports = {
    db
}

