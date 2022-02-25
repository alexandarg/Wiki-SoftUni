const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required!'],
        minlength: [6, 'Title minimal lenght is at least 6 characters long!']
    },
    keyword: {
        type: String,
        required: [true, 'Keyword is required!'],
        minlength: [6, 'Keyword minimal lenght is at least 6 characters long!'],
    },
    location: {
        type: String,
        required: [true, 'Location is required!'],
        maxlength: [15, 'Location maximum lenght is 15 characters long!'],
    },
    date: {
        type: String,
        required: [true, 'Date is required!'],
        maxlength: [10, 'Date should be exactly 10 characters long!'],
        minlength: [10, 'Date should be exactly 10 characters long!'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Image url is required!'],
        validate: [/^[https?]+:\/\//, 'Image url is invalid!'],
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        minlength: [8, 'Description should be at least 8 characters long!'],
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    votes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    ],
    totalRating: {
        type: Number,
        default: 0,
    },
})

postSchema.method('getVotedUsers', function () {
    return this.votes.map(x => x.email).join(', ');
})

exports.Post = mongoose.model('Post', postSchema);