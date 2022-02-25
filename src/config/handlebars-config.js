const { engine } = require('express-handlebars');
const path = require('path');

const initHandlebars = (app) => {
    app.set('views', path.resolve(__dirname, '../views'));
    app.engine('hbs', engine({
        extname: 'hbs',
    }));
    app.set('view engine', 'hbs');
}

module.exports = initHandlebars;