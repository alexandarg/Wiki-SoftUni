const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.json')[env];

const express = require('express');
const initHandlebars = require('./config/handlebars-config');
const initExpress = require('./config/express-config');
const initDb = require('./config/config-database')
const cookieParser = require('cookie-parser');
const routes = require('./config/routes');
const { auth } = require('./middlewares/authMiddleware');

const app = express();

initExpress(app);
app.use(cookieParser());
app.use(auth);
initHandlebars(app);
app.use(routes);


initDb(config.DB_CONNECTION_STRING)
    .then(() => {
        app.listen(config.PORT, console.log(`Server is running on http://localhost:${config.PORT}`));
    })
    .catch((err) => {
        console.log('Application init failer due to unexpected error: ', err);
    })