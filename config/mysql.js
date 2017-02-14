module.exports = function(){
    var mysql = require('mysql');

    var conn = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'ruddlf90',
        database : 'kky_db'
    });

    conn.connect();

    return conn;
}
