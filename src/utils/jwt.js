const jwt = require('jsonwebtoken');

exports.sign = function (payload, secret) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, function (err, decodedToken) {
            if (err) {
                reject(err);
            } else {
                resolve(decodedToken);
            }
        })
    })
}

exports.verify = function (token, secret) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, function (err, decodedToken) {
            if (err) {
                reject(err);
            } else {
                resolve(decodedToken);
            }
        })
    })
}