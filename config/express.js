module.exports = function(express) {
    var bodyParser = require('body-parser');

    var options = {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'ruddlf90',
        database: 'kky_db'
    };
    var session = require('express-session');
    var MySQLStore = require('express-mysql-session')(session);
    var sessionStore = new MySQLStore(options);
    var app = express();

    app.locals.pretty = true;
    app.set('view engine', 'ejs');
    app.set('views', './views_main');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({
        secret: '1234DDFSADAFI@$%',
        store: sessionStore,
        resave: false,
        saveUninitialized: true
    }));

    return app;
}
