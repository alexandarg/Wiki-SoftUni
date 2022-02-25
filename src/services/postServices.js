const { Post } = require('../models/Post');

const getAll = () => Post.find({}).lean();

const getById = (id) => Post.findById(id).populate('votes').populate('author');

const create = (postData) => Post.create(postData);

const vote = async (option, userId, id) => {
    const post = await Post.findById(id);

    post.votes.push(userId);
    option == 'up' ? post.totalRating += 1 : post.totalRating -= 1;

    post.save();
}

const remove = (id) => Post.findByIdAndDelete(id);

const update = (id, postData) => Post.findByIdAndUpdate(id, postData, { runValidators: true });

const getPostsByAuthor = (userId) => Post.find({author: userId}).populate('author', 'firstName lastName').lean();

exports.postServices = {
    getAll,
    create,
    getById,
    vote,
    remove,
    update,
    getPostsByAuthor,
}