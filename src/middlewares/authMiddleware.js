const res = require('express/lib/response');
const { TOKEN_COOKIE_NAME, TOKEN_SECRET } = require('../constants');

const jwt = require('../utils/jwt');
const { postServices } = require('../services/postServices');

exports.auth = function (req, res, next) {
    const token = req.cookies[TOKEN_COOKIE_NAME];

    if (!token) {
        return next();
    }

    jwt.verify(token, TOKEN_SECRET)
        .then((decodedToken) => {
            req.user = decodedToken;
            res.locals.user = decodedToken;
            next();
        })
        .catch((err) => {
            res.status(401).send(err);
        })
}

exports.isUser = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        res.status(401).redirect('/auth/login');
    }
}

exports.isGuest = function (req, res, next) {
    if (!req.user) {
        next();
    } else {
        res.status(401).redirect('/');
    }
};

exports.isOwner = async function (req, res, next) {
    const post = await postServices.getById(req.params.postId);

    if (req.user._id == post.author._id) {
        next();
    } else {
        res.status(401).render('404');
    }
}