const express = require('express');
const path = require('path');

const initExpress = (app) => {
    app.use(express.urlencoded({ extended: true }))
    app.use('/static', express.static(path.resolve(__dirname, '../public')))
}

module.exports = initExpress;