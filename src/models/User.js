const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../constants');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required!'],
        minlength: [3, 'First name should be at least 3 characters long!'],
        validate: [/[A-Za-z]+/, 'First name should consists only of english letters'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required!'],
        minlength: [5, 'Last name should be at least 5 characters long!'],
        validate: [/[A-Za-z]+/, 'First name should consists only of english letters'],
    },
    email: {
        type: String,
        required: [true, 'Email address is required!'],
        validate: [/[a-z0-9_.]+@[a-z]+\.[a-z]+/gm, 'Invalid email address!'],
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        minlength: [4, 'Password should be at least 4 characters long!'],
    },
    posts: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Posts',
        }
    ],
});

userSchema.pre('save', function (next) {
    bcrypt.hash(this.password, SALT_ROUNDS)
        .then((hash) => {
            this.password = hash;

            next();
        });
});

userSchema.virtual('rePassword')
    .set(function (rePassword) {
        if (rePassword !== this.password) {
            throw new Error('Password doesn\'t match');
        }
    });

userSchema.method('validatePassword', function (password) {
    return bcrypt.compare(password, this.password);
})

exports.User = mongoose.model('User', userSchema);