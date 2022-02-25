const { User } = require('../models/User');
const jwt = require('../utils/jwt');
const { TOKEN_SECRET } = require('../constants');

const login = async (email, password) => {
    if (!email) {
        throw new Error('Email field is required!');
    }

    if (!password) {
        throw new Error('Password field is required!');
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('There\'s no such user in the database');
    }

    const isValid = await user.validatePassword(password);

    if (!isValid) {
        throw new Error('Password is incorrect');
    }

    const payload = {
        _id: user._id,
        email: user.email,
    }

    const token = await jwt.sign(payload, TOKEN_SECRET);

    return token
}

const register = (userData) => User.create(userData);

exports.authServices = {
    login,
    register,
}