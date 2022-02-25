const mongoose = require('mongoose');

function initDb (connestionString) {
    return mongoose.connect(connestionString);
}

module.exports = initDb;