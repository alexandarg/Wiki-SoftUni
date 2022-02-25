const router = require('express').Router();

const { TOKEN_COOKIE_NAME, TOKEN_SECRET } = require('../constants');
const { authServices } = require('../services/authServices');
const { isUser, isGuest } = require('../middlewares/authMiddleware');

router.get('/login', isGuest, (req, res) => {
    res.render('auth/login');
});

router.post('/login', isGuest, async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await authServices.login(email, password);

        console.log(`User has logged successfully with the email \"${email}\"`);

        res.cookie(TOKEN_COOKIE_NAME, token).redirect('/');
    } catch (error) {
        error.errors
            ? res.locals.errors = Object.keys(error.errors).map(x => error.errors[x].message)
            : res.locals.error = error.message;

        res.status(400).render('auth/login');
    }
});

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register');
});

router.post('/register', isGuest, async (req, res) => {
    const { firstName, lastName, email, password, rePassword } = req.body;

    try {
        await authServices.register({
            firstName,
            lastName,
            email,
            password,
            rePassword,
        });

        console.log(`${firstName} ${lastName} has registered successfully using the email \"${email}\"`);

        const token = await authServices.login(email, password);

        res.cookie(TOKEN_COOKIE_NAME, token).redirect('/');
    } catch (error) {
        error.errors
            ? res.locals.errors = Object.keys(error.errors).map(x => error.errors[x].message)
            : res.locals.error = error.message;

        res.status(400).render('auth/register');
    }
});

router.get('/logout', isUser, (req, res) => {
    res.clearCookie(TOKEN_COOKIE_NAME).redirect('/');
});

module.exports = router;